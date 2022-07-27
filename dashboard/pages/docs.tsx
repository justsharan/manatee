import { GetStaticPropsContext } from "next";
import Layout from "components/Layout";
import styles from "./docs.module.css";

type CommandInfo = {
  id: string;
  dm_permission: boolean;
  type: number;
  name: string;
  description: string;
  options: {
    type: number;
    name: string;
    description: string;
    required: boolean;
  }[];
};

export default function Docs({ cmds }: { cmds: CommandInfo[] } & object) {
  return (
    <Layout title="Docs">
      <section className={styles.list}>
        {cmds
          .filter((c) => c.type === 1)
          .map((cmd) => (
            <fieldset key={cmd.id}>
              <legend className={styles.header}>
                <h3>
                  /{cmd.name}{" "}
                  {cmd.options &&
                    cmd.options.map((o) => <span key={o.name}>{o.name}</span>)}
                </h3>
              </legend>
              {cmd.description}
            </fieldset>
          ))}
      </section>
    </Layout>
  );
}

export async function getStaticProps({ locale }: GetStaticPropsContext) {
  return {
    props: {
      cmds: (await import(`public/cmds.json`)).default,
      messages: (await import(`public/locales/${locale}.json`)).default,
    },
  };
}
