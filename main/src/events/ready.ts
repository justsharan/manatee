import { client } from "../index";

export default () => {
  console.log(`Connected as ${client.user?.tag}!`);
};
