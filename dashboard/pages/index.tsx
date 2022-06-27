import { GetStaticPropsContext } from "next";
import Navbar from "components/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
    </>
  );
}

export async function getStaticProps({ locale }: GetStaticPropsContext) {
  return {
    props: {
      messages: (await import(`public/locales/${locale}.json`)).default,
    },
  };
}
