import { prismaClient } from "../application/database.js";

const getAllCategory = async (request) => {
  const categories = await prismaClient.categories.findMany();

  const result = categories.map((category) => ({
    id: category.id,
    name: category.name,
  }));

  return result;
};

export default {
  getAllCategory,
};
