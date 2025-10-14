import NextAuth, { NextAuthOptions } from "next-auth";
import TwitchProvider from "next-auth/providers/twitch";
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
    })
  ],
  
  secret: process.env.NEXTAUTH_SECRET,
  
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        if (account && profile) {
          const twitchProfile = profile as any;
          
          // Check if user exists in database
          const existingUser = await pool.query(
            'SELECT id FROM users WHERE twitch_id = $1',
            [account.providerAccountId]
          );

          if (existingUser.rows.length === 0) {
            // Create new user
            await pool.query(
              `INSERT INTO users (twitch_id, username, email, display_name, profile_image_url)
               VALUES ($1, $2, $3, $4, $5)`,
              [
                account.providerAccountId,
                twitchProfile.preferred_username || user.name,
                user.email,
                twitchProfile.display_name || user.name,
                twitchProfile.profile_image_url || user.image
              ]
            );
          } else {
            // Update existing user
            await pool.query(
              `UPDATE users SET 
                profile_image_url = $1,
                display_name = $2
               WHERE twitch_id = $3`,
              [
                twitchProfile.profile_image_url || user.image,
                twitchProfile.display_name || user.name,
                account.providerAccountId
              ]
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
        token.profile_image_url = (profile as any).profile_image_url;
        token.display_name = (profile as any).display_name;
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