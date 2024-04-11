import { api } from "@nitric/sdk";
import { speak } from "../common/handlers";

// Create a secure api
const animalsApi = api("main");

// Create and expose a GET method on our api
animalsApi.get("/hello/:animal", speak);
