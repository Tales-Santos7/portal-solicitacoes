import { app } from "./app";
import { env } from "./lib/env";

app.listen(env.PORT, () => {
  console.log(`API executando em http://localhost:${env.PORT}`);
});
