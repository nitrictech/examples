import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

const AddressModel = z.object({
  streetNumber: z.union([z.number().int(), z.string()]),
  street: z.string(),
  city: z.string(),
  state: z.string(),
});

const QuestionnaireModel = z.object({
  isPizzaFan: z.boolean().describe("My favorite snack is Pizza."),
  isIceCreamFan: z.boolean().describe("My favourite snack is Icecream."),
});

const CustomerModel = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  address: AddressModel,
  questionnaire: QuestionnaireModel,
});

export const FormModel = z.object({
  primary: CustomerModel,
  secondary: CustomerModel.optional(),
});

export const FormPartialModel = FormModel.deepPartial();

export const surveyJsonSchema = () => {
  return zodToJsonSchema(FormModel, "surveySchema");
};

export type FormDataPartial = z.infer<typeof FormPartialModel>;
export type FormData = z.infer<typeof FormModel>;
