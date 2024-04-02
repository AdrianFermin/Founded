'use client'

export default function Home({
    searchParams,
  }: {
    searchParams?: {
      token?: string;
    };
  }){

    console.log(searchParams?.token)

    return(
        <>
            <div>Hola</div>
        </>
    )
}