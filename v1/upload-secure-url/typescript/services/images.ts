import { getUrl } from "../common/handlers";
import { fileApi } from "../common/resources";

fileApi.get("/images/:id/upload", getUrl);

fileApi.get("/images/:id/download", getUrl);
