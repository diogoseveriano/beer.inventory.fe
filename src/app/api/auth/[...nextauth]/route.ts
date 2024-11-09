import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios';
import jwt from 'jsonwebtoken';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.error('Missing credentials');
          return null;
        }

        try {
          const response = await axios.post(`${process.env.SERVER_URL}/api/login`, {
            email: credentials.email,
            password: credentials.password,
          });

          const { token, email, username } = response.data; // Assuming response contains these fields

          if (token) {
            return {
              token,
              email,
              username, // Pass the username and email along with the token
            };
          }

          return null;
        } catch (error) {
          console.error('Authorization error:', error.response?.data || error.message);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // Add user details and token to the JWT
        token.accessToken = user.token;
        token.email = user.email;
        token.name = user.username; // Add username to the token
      }

      return token;
    },

    async session({ session, token }) {
      // Attach user details to the session
      session.accessToken = token.accessToken; // Add the accessToken to the session
      session.user = {
        ...session.user,
        email: token.email, // Add email to session user
        name: token.name, // Add username to session user
      };

      const decoded = jwt.decode(token.accessToken);
      if (decoded?.exp) {
        const expirationDate = new Date(decoded.exp * 1000);
        session.expires = expirationDate.toISOString();

        if (expirationDate && new Date() > new Date(expirationDate)) {

          return null;
        }
      }

      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 3600,
    updateAge: 60
  },
});

export { handler as GET, handler as POST };
