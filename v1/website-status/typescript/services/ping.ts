import { handlePing } from "../common/handlers";
import { myApis } from "../common/resources";

myApis.post("/ping", handlePing);
