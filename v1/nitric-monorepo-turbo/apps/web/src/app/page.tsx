import Image from "next/image";
import { Metadata } from "next";
import { DataTable } from "@/components/data-table";
import fetch from "@/lib/fetch";
import { InferSelectModel, todo } from "@repo/database";
import { columns } from "@/components/columns";

export const metadata: Metadata = {
  title: "Todos",
  description: "A todo task tracker build using Nitric.",
};

export default async function Home() {
  const todos = await fetch<InferSelectModel<typeof todo>[]>("/todos");

  console.log(todos);

  return (
    <div>
      <main>
        <Image
          src='/next.svg'
          alt='Next.js logo'
          width={180}
          height={38}
          priority
        />

        <>
          <div className='md:hidden'>
            <Image
              src='/examples/tasks-light.png'
              width={1280}
              height={998}
              alt='Playground'
              className='block dark:hidden'
            />
            <Image
              src='/examples/tasks-dark.png'
              width={1280}
              height={998}
              alt='Playground'
              className='hidden dark:block'
            />
          </div>
          <div className='hidden h-full flex-1 flex-col space-y-8 p-8 md:flex'>
            <div className='flex items-center justify-between space-y-2'>
              <div>
                <h2 className='text-2xl font-bold tracking-tight'>
                  Welcome back!
                </h2>
                <p className='text-muted-foreground'>
                  Here&apos;s a list of your tasks for this month!
                </p>
              </div>
            </div>
            <DataTable data={todos} columns={columns} />
          </div>
        </>
      </main>
      <footer>
        <a
          href='https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app'
          target='_blank'
          rel='noopener noreferrer'
        >
          <Image
            aria-hidden
            src='/file-text.svg'
            alt='File icon'
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          href='https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app'
          target='_blank'
          rel='noopener noreferrer'
        >
          <Image
            aria-hidden
            src='/window.svg'
            alt='Window icon'
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          href='https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app'
          target='_blank'
          rel='noopener noreferrer'
        >
          <Image
            aria-hidden
            src='/globe.svg'
            alt='Globe icon'
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
