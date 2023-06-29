import CredentialsProviders from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";

export const authOptions = {
    session: {
        strategy: "jwt",
    },
    providers: [
        CredentialsProviders({
            name: "Sign in",
            credentials: {
                email: {
                    label: "Email",
                    type: "email",
                    placeholder: "example@example.com",
                },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials.password) {
                    return null;
                }

                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials.email,
                    },
                });

                if (!user || !credentials.password === user.password) {
                    return null;
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    randomKey: "Hey cool",
                };
            },
        }),
    ],
};
