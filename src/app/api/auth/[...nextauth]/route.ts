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

          const { token, email, username, role } = response.data;

          if (token) {
            return {
              token,
              email,
              username,
              role
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
        token.accessToken = user.token;
        token.email = user.email;
        token.name = user.username;
        token.role = user.role;
      }

      return token;
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.user = {
        ...session.user,
        email: token.email,
        name: token.name,
        role: token.role
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
