import { NextAuthOptions } from 'next-auth';
import TwitchProvider from 'next-auth/providers/twitch';
import db from './db';

// Define Twitch profile type
interface TwitchProfile {
  sub: string;
  preferred_username: string;
  email: string;
  picture: string;
}

export const authOptions: NextAuthOptions = {
  providers: [
    TwitchProvider({
      clientId: process.env.TWITCH_CLIENT_ID!,
      clientSecret: process.env.TWITCH_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'openid user:read:email channel:read:subscriptions',
          claims: {
            id_token: {
              email: null,
              picture: null,
              preferred_username: null,
            },
          },
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!account || !profile) return false;

      // Type guard to check if profile has required Twitch properties
      const twitchProfile = profile as unknown as TwitchProfile;

      try {
        // Check if user exists
        const existingUser = await db.query(
          'SELECT * FROM users WHERE twitch_id = $1',
          [account.providerAccountId]
        );

        if (existingUser.rows.length === 0) {
          // Create new user
          await db.query(
            `INSERT INTO users (twitch_id, username, email, profile_image_url, access_token, refresh_token)
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [
              account.providerAccountId,
              twitchProfile.preferred_username || user.name || 'Unknown',
              user.email || twitchProfile.email,
              user.image || twitchProfile.picture,
              account.access_token,
              account.refresh_token,
            ]
          );
        } else {
          // Update existing user tokens
          await db.query(
            `UPDATE users 
             SET access_token = $1, refresh_token = $2, updated_at = NOW()
             WHERE twitch_id = $3`,
            [account.access_token, account.refresh_token, account.providerAccountId]
          );
        }

        return true;
      } catch (error) {
        console.error('Error in signIn callback:', error);
        return false;
      }
    },
    async session({ session, token }) {
      if (token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
      }
      return token;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
};