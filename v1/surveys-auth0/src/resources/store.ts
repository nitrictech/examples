import { kv } from "@nitric/sdk";
import { v4 as uuid } from "uuid";
import { FormData, FormDataPartial, FormModel, Submission } from "../forms";
import { submissionTopic } from "./topics";

const submissionEvents = submissionTopic.for("publishing");
type SurveySubmission = Submission<FormDataPartial>;

const newSubmissionId = (): string => {
  return uuid().split("-")[0];
};

const surveyKVstore = kv("profiles").for("getting", "setting");

// Helper function to get current surveys
async function getSurveys() {
  try {
    const serializedList = await surveyKVstore.get("surveys");
    return serializedList && serializedList["ids"]
      ? JSON.parse(serializedList["ids"])
      : [];
  } catch (error) {
    await surveyKVstore.set("surveys", { ids: [] });
    return [];
  }
}

// Helper function to update surveys list
async function updateSurveys(surveyList: Array<String>) {
  try {
    const updatedSerializedList = JSON.stringify(surveyList);
    await surveyKVstore.set("surveys", { ids: updatedSerializedList });
  } catch (error) {
    console.error("Error updating surveys:", error);
  }
}

type StoreResult =
  | { success: true; submissionId: string }
  | { success: false; error: any };

const getSubmission = async (
  submissionId?: string
): Promise<SurveySubmission | undefined> => {
  if (!submissionId) {
    return;
  }
  try {
    const allSubmissions = await getSurveys();
    return allSubmissions.find(
      (profile: { id: any }) => profile.id === submissionId
    );
  } catch (err) {
    return;
  }
};

// TODO: Remove me - this is a convenience method for development...
const getAllSubmissions = async () => {
  try {
    return await getSurveys();
  } catch (err) {
    return;
  }
};

// TODO: Remove me - this is a convenience method for development...
const deleteAllSubmissions = async () => {
  try {
    await updateSurveys([]);
  } catch (err) {
    return;
  }
};

// TODO: This should be done with a where, but it won't query 5 levels deep into the json.
const getSubmissionIdsByEmail = async (email?: string) => {
  if (!email) {
    return;
  }
  try {
    const results = await getSurveys();

    const survey = results.find(
      (s: SurveySubmission) => s.data.primary?.email === email
    );

    return survey;
  } catch (err) {
    return;
  }
};

const removeEmptyOrNull = (obj: { [x: string]: any }) => {
  Object.keys(obj).forEach(
    (k) =>
      (obj[k] && typeof obj[k] === "object" && removeEmptyOrNull(obj[k])) ||
      (!obj[k] && obj[k] !== undefined && delete obj[k])
  );
  return obj;
};

export const surveyStore = {
  get: getSubmission,
  getSubmissions: getAllSubmissions,
  reset: deleteAllSubmissions,
  getSubmissionsByEmail: getSubmissionIdsByEmail,

  save: async (data: any, submissionId?: string): Promise<StoreResult> => {
    const existing = await getSubmission(submissionId);
    if (submissionId && !existing) {
      return { success: false, error: "not found" };
    }
    if (existing && existing.status === "submitted") {
      return { success: false, error: "already submitted" };
    }

    // We don't want zod to validate empty fields here, so trim the data
    const validated = FormModel.deepPartial().safeParse(
      removeEmptyOrNull(data)
    );
    if (!validated.success) {
      return { ...validated };
    } else {
      const submissionData: SurveySubmission = {
        submissionId: submissionId ?? newSubmissionId(),
        status: "saved",
        data: validated.data,
      };

      const allSurveys = await getSurveys();
      allSurveys.push(submissionData);
      await updateSurveys(allSurveys);
      return { success: true, submissionId: submissionData.submissionId };
    }
  },
  submit: async (data: unknown, submissionId: string): Promise<StoreResult> => {
    const existing = await getSubmission(submissionId);
    if (submissionId && !existing) {
      return { success: false, error: "not found" };
    }
    if (existing && existing.status === "submitted") {
      return { success: false, error: "already submitted" };
    }
    const validated = FormModel.safeParse(data);
    if (!validated.success) {
      return { ...validated };
    } else {
      const submissionData: Submission<FormData> = {
        submissionId: submissionId ?? newSubmissionId(),
        status: "submitted",
        data: validated.data,
      };
      const allSurveys = await getSurveys();
      allSurveys.push(submissionData);
      await updateSurveys(allSurveys);
      await submissionEvents.publish(submissionData);
      return { success: true, submissionId: submissionData.submissionId };
    }
  },
};
