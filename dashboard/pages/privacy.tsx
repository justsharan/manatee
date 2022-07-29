import { GetStaticPropsContext } from "next";
import { readFile } from "fs/promises";
import { marked } from "marked";
import Layout from "components/Layout";

export default function Privacy({ parsed }: { parsed: string }) {
  return (
    <Layout title="Privacy Policy">
      <section dangerouslySetInnerHTML={{ __html: parsed }}></section>
    </Layout>
  );
}

export async function getStaticProps({ locale }: GetStaticPropsContext) {
  return {
    props: {
      messages: (await import(`public/locales/${locale}.json`)).default,
      parsed: marked(await readFile("../privacy.md", "utf-8")),
    },
  };
}
