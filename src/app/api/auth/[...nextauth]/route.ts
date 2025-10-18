import NextAuth, { NextAuthOptions } from "next-auth";
import TwitchProvider from "next-auth/providers/twitch";
import GoogleProvider from "next-auth/providers/google";
import pool from "@/lib/db";

export const authOptions: NextAuthOptions = {
  providers: [
    TwitchProvider({
      clientId: process.env.TWITCH_CLIENT_ID!,
      clientSecret: process.env.TWITCH_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: ["user:read:email", "channel:read:subscriptions", "openid"].join(" "),
          response_type: "code",
          access_type: "offline",
          prompt: "consent"
        }
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'openid email profile https://www.googleapis.com/auth/youtube.readonly',
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code'
        },
      },
    }),
  ],
  
  secret: process.env.NEXTAUTH_SECRET,
  
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        if (account && profile) {
          const provider = account.provider;
          const providerAccountId = account.providerAccountId;
          const email = user.email || `${providerAccountId}@${provider}.placeholder`;
          
          let username = '';
          let displayName = '';
          let profileImage = user.image || '';

          // Handle different providers
          if (provider === 'twitch') {
            const twitchProfile = profile as any;
            username = twitchProfile.preferred_username || user.name || '';
            displayName = twitchProfile.display_name || user.name || '';
            profileImage = twitchProfile.profile_image_url || user.image || '';
          } else if (provider === 'google') {
            // For YouTube, use Google account info
            username = user.email?.split('@')[0] || user.name || '';
            displayName = user.name || '';
            profileImage = user.image || '';
          }

          // Check if user exists
          const existingUser = await pool.query(
            'SELECT * FROM users WHERE email = $1 OR (provider = $2 AND provider_account_id = $3)',
            [email, provider, providerAccountId]
          );

          if (existingUser.rows.length === 0) {
            // Create new user
            await pool.query(
              `INSERT INTO users (
                username, 
                email, 
                display_name, 
                profile_image_url,
                provider,
                provider_account_id,
                twitch_id
              ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
              [
                username, 
                email, 
                displayName, 
                profileImage, 
                provider, 
                providerAccountId,
                provider === 'twitch' ? providerAccountId : null
              ]
            );
          } else {
            // Update existing user
            await pool.query(
              `UPDATE users 
               SET display_name = $1, 
                   profile_image_url = $2,
                   provider = $3,
                   provider_account_id = $4,
                   updated_at = CURRENT_TIMESTAMP
               WHERE email = $5`,
              [displayName, profileImage, provider, providerAccountId, email]
            );
          }
        }
        return true;
      } catch (error) {
        console.error('Error in signIn callback:', error);
        return true; // Still allow sign in even if DB fails
      }
    },

    async session({ session, token }) {
      if (token) {
        session.user = {
          id: (token.sub as string) || '',
          name: (token.name as string) || (token.display_name as string) || '',
          email: (token.email as string) || '',
          image: (token.picture as string) || (token.profile_image_url as string) || ''
        };
      }
      return session;
    },
    
    async jwt({ token, user, account, profile }) {
      if (account && profile) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.provider = account.provider;
        
        if (account.provider === 'twitch') {
          token.profile_image_url = (profile as any).profile_image_url;
          token.display_name = (profile as any).display_name;
        }
      }
      return token;
    },
    
    async redirect({ url, baseUrl }) {
      const tunnelUrl = process.env.NEXTAUTH_URL || baseUrl;
      
      if (url === baseUrl || url === `${baseUrl}/`) {
        return `${tunnelUrl}/dashboard`;
      }
      
      if (url.startsWith("/")) return `${tunnelUrl}${url}`;
      if (new URL(url).origin === tunnelUrl) return url;
      return `${tunnelUrl}/dashboard`;
    }
  },
  
  debug: process.env.NODE_ENV === 'development',
  
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error'
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };