import { uuid } from "uuidv4";
import { api, kv } from "@nitric/sdk";
import { graphql, buildSchema } from "graphql";

const schema = buildSchema(`
  type Profile {
    pid: String!
    name: String!
    age: Int!
    home: String!
  }

  input ProfileInput {
    name: String!
    age: Int!
    home: String!
  }

  type Query {
    getProfiles: [Profile]
    getProfile(pid: String!): Profile
  }

  type Mutation {
    createProfile(profile: ProfileInput!): Profile
    updateProfile(pid: String!, profile: ProfileInput!): Profile
  }
`);

interface Profile {
  pid: string;
  name: string;
  age: number;
  home: string;
}

type ProfileInput = Omit<Profile, "pid">;

const profiles = kv<ProfileInput>("profiles").for("getting", "setting");

const createProfile = async ({ profile }): Promise<Profile> => {
  const pid = uuid();

  await profiles.set(pid, profile);

  return {
    pid,
    ...profile,
  };
};

const updateProfile = async ({ pid, profile }) => {
  await profiles.set(pid, profile);

  return {
    pid,
    ...profile,
  };
};

const getProfile = async ({ pid }): Promise<Profile> => {
  const profile = await profiles.get(pid);

  return {
    pid,
    ...profile,
  };
};

const resolvers = {
  getProfile,
  createProfile,
  updateProfile,
};

const profileApi = api("public");

profileApi.post("/", async (ctx) => {
  const { query } = ctx.req.json();
  const result = await graphql({
    schema: schema,
    source: query,
    rootValue: resolvers,
  });

  return ctx.res.json(result);
});
