import {
    LoginButton,
    RegisterButton,
    ProfileButton,
    LogoutButton,
} from "@/components/authButtons";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ComponenteUser } from "@/components/componenteUser";
import { prisma } from "@/lib/prisma";

async function initData(prisma) {
    try {
        const allUser = await prisma.user.findMany();
        if (allUser.length < 5) {
            await prisma.user.createMany({
                data: [
                    {
                        name: "juan",
                        email: "juan@juan.com",
                        password: "secret",
                    },
                    {
                        name: "pedro",
                        email: "pedron@pedro.com",
                        password: "secret",
                    },
                    { name: "ana", email: "ana@ana.com", password: "secret" },
                    {
                        name: "sofia",
                        email: "sofia@sofia.com",
                        password: "secret",
                    },
                    {
                        name: "martin",
                        email: "martin@martin.com",
                        password: "secret",
                    },
                ],
            });
        } else {
            return;
        }
    } catch (error) {
        console.error(error);
    }
}

export default async function Home() {
    const session = await getServerSession(authOptions);
    console.log(session);
    await initData(prisma);
    const allUser = await prisma.user.findMany();
    await prisma.$disconnect();
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <h1>En Teoria aca estaran todos los usuarios</h1>
            <div>
                {allUser instanceof Array
                    ? allUser.length === 0
                        ? "NO HAY DATOS"
                        : allUser.map((data) => {
                              return (
                                  <div key={`${data.id}-${data.name}-key`}>
                                      <ul>
                                          <li>id:{data.id}</li>
                                          <li>name:{data.name}</li>
                                          <li>email:{data.email}</li>
                                      </ul>
                                  </div>
                              );
                          })
                    : "EXPLOTO ALGO"}
            </div>

            <div>
                <LoginButton />
                <RegisterButton />
                <LogoutButton />
                <ProfileButton />
            </div>
            <h1>Server Session</h1>
            <pre>{JSON.stringify(session)}</pre>
            <ComponenteUser />
        </main>
    );
}
