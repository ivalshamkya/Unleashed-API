import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import jwt from "jsonwebtoken";
import { logger } from "../application/logging.js";

const createBlog = async (request) => {
  const { title, content, country, CategoryId, keywords } = request.body;
  
  const newFilename = request.file.filename;

  const token = request.headers["authorization"].split(" ")[1];

  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

  const email = decodedToken.email;

  const user = await prismaClient.user.findFirst({
    where: {
      email: email,
    },
  });

  const keywordArray = keywords ? keywords.split(" ") : "";
  const keywordIds = [];

  for (const keyword of keywordArray) {
    const existingKeyword = await prismaClient.keyword.findFirst({
      where: {
        name: keyword,
      },
    });

    if (existingKeyword) {
      keywordIds.push(existingKeyword.id);
    } else {
      const newKeyword = await prismaClient.keyword.create({
        data: {
          name: keyword,
        },
      });

      keywordIds.push(newKeyword.id);
    }
  }

  const blog = await prismaClient.blog.create({
    data: {
      title: title,
      imageURL: newFilename,
      content: content,
      country: country,
      isPublished: false,
      isDeleted: false,
      UserId: user.id,
      CategoryId: CategoryId ? parseInt(CategoryId) : 1,
    },
  });

  await prismaClient.blog_Keyword.createMany({
    data: keywordIds.map((keywordId) => ({
      BlogId: blog.id,
      KeywordId: keywordId,
    })),
    skipDuplicates: true,
  });

  return blog;
};

const getBlogs = async (request) => {
  const { id_cat, sort, page, search, sortBy, size } = request.query;

  const totalRows = await prismaClient.blog.count({
    where: {
      ...(id_cat ? { CategoryId: parseInt(id_cat) } : {}),
      title: {
        ...(search ? { contains: search } : {}),
      },
    },
  });

  const blogs = await prismaClient.blog.findMany({
    where: {
      ...(id_cat ? { CategoryId: parseInt(id_cat) } : {}),
      title: {
        ...(search ? { contains: search } : {}),
      },
      isDeleted: false,
    },
    orderBy: {
      [sortBy ? sortBy : "title"]: sort,
    },
    take: size ? parseInt(size) : undefined,
    skip: page ? (parseInt(page) - 1) * (parseInt(size) || 0) : undefined,
    include: {
      User: {
        select: {
          username: true,
          imgProfile: true,
        },
      },
      Category: true,
      Blog_Keywords: {
        include: {
          Keyword: true,
        },
      },
    },
  });

  return {
    page: parseInt(page) || 1,
    rows: totalRows,
    blogPage: parseInt(page) || 1,
    listLimit: size ? parseInt(size) : undefined,
    result: blogs,
  };
};

const getBlogsAuth = async (request) => {
  const { id_cat, sort, page, search, sortBy, size } = request.query;

  const token = request.headers["authorization"].split(" ")[1];

  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

  const email = decodedToken.email;

  const user = await prismaClient.user.findFirst({
    where: {
      email: email,
    },
  });

  const totalRows = await prismaClient.blog.count({
    where: {
      ...(id_cat ? { CategoryId: parseInt(id_cat) } : {}),
      title: {
        ...(search ? { contains: search } : {}),
      },
    },
  });

  const blogs = await prismaClient.blog.findMany({
    where: {
      ...(id_cat ? { CategoryId: parseInt(id_cat) } : {}),
      title: {
        ...(search ? { contains: search } : {}),
      },
      isDeleted: false,
    },
    orderBy: {
      [sortBy ? sortBy : "title"]: sort,
    },
    take: size ? parseInt(size) : undefined,
    skip: page ? (parseInt(page) - 1) * (parseInt(size) || 0) : undefined,
    include: {
      User: {
        select: {
          username: true,
          imgProfile: true,
        },
      },
      Category: true,
      Blog_Keywords: {
        include: {
          Keyword: true,
        },
      },
      Likes: {
        where: {
          userId: user.id,
        },
        select: {
          id: true,
        },
      },
    },
  });

  const result = blogs.map((blog) => {
    const isLiked = blog.Likes.length > 0;
    return {
      ...blog,
      isLiked,
    };
  });

  return {
    page: parseInt(page) || 1,
    rows: totalRows,
    blogPage: parseInt(page) || 1,
    listLimit: size ? parseInt(size) : undefined,
    result: result,
  };
};

const getBlogsByUser = async (request) => {
  const { id_cat, sort, page, search, sortBy, size } = request.query;

  const token = request.headers["authorization"].split(" ")[1];

  const decodedToken = jwt.verify(token, secret);

  const email = decodedToken.email;

  const user = await prismaClient.user.findFirst({
    where: {
      email: email,
    },
  });

  const blogs = await prismaClient.blog.findMany({
    where: {
      UserId: userId,
      ...(id_cat ? { CategoryId: parseInt(id_cat) } : {}),
      title: {
        ...(search ? { contains: search } : {}),
      },
      isDeleted: false,
    },
    orderBy: {
      [sortBy ? sortBy : "title"]: sort,
    },
    take: size ? parseInt(size) : undefined,
    skip: page ? (parseInt(page) - 1) * (parseInt(size) || 0) : undefined,
    include: {
      User: {
        select: {
          username: true,
          imgProfile: true,
        },
      },
      Category: true,
      Blog_Keywords: {
        include: {
          Keyword: true,
        },
      },
      Likes: {
        where: {
          userId: userId,
        },
        select: {
          id: true,
        },
      },
    },
  });

  const result = blogs.map((blog) => {
    const isLiked = blog.Likes.length > 0;
    return {
      ...blog,
      isLiked,
    };
  });

  return result;
};

const likeBlog = async (request) => {
  const { BlogId } = request.body;
  const token = request.headers["authorization"].split(" ")[1];

  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  const email = decodedToken.email;

  const user = await prismaClient.user.findFirst({
    where: {
      email: email,
    },
  });

  const blog = await prismaClient.blog.findUnique({
    where: {
      id: BlogId,
    },
  });

  if (!blog) {
    throw new ResponseError(404, "Blog not found");
  }

  const existingLike = await prismaClient.like.findFirst({
    where: {
      BlogId: BlogId,
      UserId: user.id,
    },
  });

  if (existingLike) {
    throw new ResponseError(400, "You have already liked this blog");
  }

  const newLike = await prismaClient.like.create({
    data: {
      UserId: user.id,
      BlogId: BlogId,
    },
  });

  return newLike;
};

const unlikeBlog = async (request) => {
  const { userId } = request.params;
  const { BlogId } = request.body;
  const token = request.headers["authorization"].split(" ")[1];

  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

  await prismaClient.like.deleteMany({
    where: {
      UserId: parseInt(userId),
      BlogId: parseInt(BlogId),
    },
  });

  return "Blog unliked successfully.";
};

const getMostFavBlogs = async (request) => {
  const { page, orderBy, sort, id_cat, search, size } = request.query;

  const blogs = await prismaClient.blog.findMany({
    where: {
      ...(id_cat ? { CategoryId: parseInt(id_cat) } : {}),
      title: {
        ...(search ? { contains: search } : {}),
      },
    },
    include: {
      Likes: true,
      User: {
        select: {
          username: true,
          imgProfile: true,
        },
      },
      Category: true,
      Blog_Keywords: {
        include: {
          Keyword: true,
        },
      },
    },
    take: size ? parseInt(size) : undefined,
    skip: page ? (parseInt(page) - 1) * (parseInt(size) || 0) : undefined,
  });

  const result = blogs.map((blog) => ({
    id: blog.id,
    title: blog.title,
    imageURL: blog.imageURL,
    content: blog.content,
    videoURL: blog.videoURL,
    country: blog.country,
    isPublished: blog.isPublished,
    isDeleted: blog.isDeleted,
    createdAt: blog.createdAt,
    updatedAt: blog.updatedAt,
    CategoryId: blog.CategoryId,
    total_fav: blog.Likes.length,
    User: blog.User
      ? {
          username: blog.User.username,
          imgProfile: blog.User.imgProfile,
        }
      : null,
    Category: {
      id: blog.Category.id,
      name: blog.Category.name,
    },
    Blog_Keywords: blog.Blog_Keywords.map((blogKeyword) => ({
      id: blogKeyword.id,
      BlogId: blogKeyword.BlogId,
      KeywordId: blogKeyword.KeywordId,
      createdAt: blogKeyword.createdAt,
      updatedAt: blogKeyword.updatedAt,
      Keyword: {
        id: blogKeyword.Keyword.id,
        name: blogKeyword.Keyword.name,
        createdAt: blogKeyword.Keyword.createdAt,
        updatedAt: blogKeyword.Keyword.updatedAt,
      },
    })),
    Likes: blog.Likes.map((like) => ({
      id: like.id,
      BlogId: like.BlogId,
      User: like.User ? { username: like.User.username } : null,
    })),
  }));

  const sortedResult = result.sort((a, b) => {
    if (orderBy === "total_fav") {
      return sort === "asc"
        ? a.total_fav - b.total_fav
        : b.total_fav - a.total_fav;
    }
    // Add additional conditions for other order by options if needed

    // Default order by createdAt
    return a.createdAt - b.createdAt;
  });

  const listLimit = size ? parseInt(size) : sortedResult.length;
  const rows = sortedResult.length;
  const blogPage = page ? parseInt(page) : 1;

  return {
    page: blogPage,
    rows,
    blogPage,
    listLimit,
    result: sortedResult,
  };
};

const pagLike = async (request) => {
  const { page, listLimit } = request.query; // Mengambil nilai page dan listLimit dari query string atau parameter URL
  const token = request.headers["authorization"].split(" ")[1];

  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  const email = decodedToken.email;

  const user = await prismaClient.user.findFirst({
    where: {
      email: email,
    },
  });

  const likes = await prismaClient.like.findMany({
    where: {
      UserId: user.id,
      Blog: {
        isDeleted: false,
      },
    },
    include: {
      Blog: {
        include: {
          Category: true,
        },
      },
    },
    take: parseInt(listLimit),
    skip: page ? (parseInt(page) - 1) * (parseInt(listLimit) || 1) : undefined,
  });

  const result = likes.map((like) => ({
    id: like.id,
    UserId: like.UserId,
    BlogId: like.BlogId,
    createdAt: like.createdAt,
    updatedAt: like.updatedAt,
    Blog: {
      title: like.Blog.title,
      content: like.Blog.content,
      Category: {
        id: like.Blog.Category.id,
        name: like.Blog.Category.name,
        createdAt: like.Blog.Category.createdAt,
        updatedAt: like.Blog.Category.updatedAt,
      },
    },
  }));

  const finalResult = {
    page: page ? parseInt(page) : 1,
    rows: result.length,
    blogPage: Math.ceil(result.length / parseInt(listLimit)),
    listLimit: parseInt(listLimit),
    result: result,
  };

  return finalResult;
};

const removeBlog = async (request) => {
  const { id } = request.params;

  const deletedBlog = await prismaClient.blog.update({
    data: {
      isDeleted: true,
    },
    where: {
      id: parseInt(id),
    },
  });

  if (!deletedBlog) {
    throw new Error(`Blog with ID ${id} not found.`);
  }

  return {
    message: `Blog with ID ${id} has been removed successfully.`,
  };
};

export default {
  createBlog,
  getBlogs,
  getBlogsAuth,
  getBlogsByUser,
  likeBlog,
  unlikeBlog,
  getMostFavBlogs,
  pagLike,
  removeBlog,
};
