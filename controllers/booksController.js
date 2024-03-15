const BookSchema = require("../models/BookModel");
const Kraken = require("kraken");

async function getBook(req, res) {
  const UsersData = await BookSchema.find();
  res.json({
    status: "success",
    data: UsersData,
  });
}
// async function createNewBook(req, res) {
//   try {
//     // Assuming you have a form in the browser
//     // var formData = new FormData(document.forms[0]);
//     // console.log(formData);

//     // // Convert FormData to a JSON object
//     // var obj = Object.fromEntries(
//     //   Array.from(formData.keys()).map((key) => [
//     //     key,
//     //     formData.getAll(key).length > 1
//     //       ? formData.getAll(key)
//     //       : formData.get(key),
//     //   ])
//     // );

//     // Log the filename
//     // const filename = ;
//     // console.log(filename);

//     // Log the converted FormData
//     console.log(obj);

//     // Uncomment and adapt the Kraken API-related code if needed

//     // Assuming you have a BookSchema model
//     const newBook = await BookSchema.create(obj);

//     res.status(201).json({
//       status: "success",
//       data: {
//         book: newBook,
//       },
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       status: "error",
//       message: "Internal server error",
//     });
//   }
// }

// async function createNewBook(req, res) {
//   //let { title, author, category, price, image, description } = req.body;

//   var formData = new FormData(document.forms[0]);

//   var obj = Object.fromEntries(
//     Array.from(formData.keys()).map((key) => [
//       key,
//       formData.getAll(key).length > 1
//         ? formData.getAll(key)
//         : formData.get(key),
//     ])
//   );

//   const filename = req.filename;
//   console.log(filename);

//   //const formDataObject = Object.fromEntries([...req.body.entries()]);

//   // for (let [key, value] of Object.entries(req.body)) {
//   //   formDataObject[key] = value;
//   // }

//   //formDataObject.image = filename;

//   console.log(formData);

//   //let { path } = req.file;

//   // const krakenClinet = new kraken({
//   //   api_key: "b16111187aa336e5f3dc8b6303632ab5",
//   //   api_secret: "69514cb4061b738c2e7d60295d710ad69a3f60b9",
//   // });

//   // const params = {
//   //   file: image,
//   //   wait: true,
//   // };

//   // krakenClinet.upload(params, function (status) {
//   //   if (status.success) {
//   //     console.log("Success. Optimized image URL: %s", status.kraked_url);
//   //   } else {
//   //     console.log("Fail. Error message: %s", status.message);
//   //   }
//   // });

//   // const newBook = await BookSchema.create({
//   //   title: title,
//   //   author: author,
//   //   image: filename,
//   //   category: category,
//   //   price: price,
//   //   description: description,
//   // });

//   const newBook = await BookSchema.create(formDataObject);

//   res.status(201).json({
//     status: "success",
//     data: {
//       book: newBook,
//     },
//   });
// }

async function createNewBook(req, res) {
  try {
    // Instantiate the Kraken module with API key and secret
    // const krakenClient = new Kraken({
    //   api_key: "b16111187aa336e5f3dc8b6303632ab5",
    //   api_secret: "69514cb4061b738c2e7d60295d710ad69a3f60b9",
    // });

    // // Specify parameters for the image upload
    // const params = {
    //   file: image,
    //   wait: true,
    // };

    // // Use the Kraken instance to upload the image
    // const krakenResponse = await krakenClient.upload(params);

    // if (krakenResponse.success) {
    //   console.log(
    //     "Success. Optimized image URL: %s",
    //     krakenResponse.kraked_url
    //   );
    // } else {
    //   console.log("Fail. Error message: %s", krakenResponse.message);
    // }

    // Create a new book in the database

    let { title, author, category, price, description } = req.body;
    const filename = req.filename;

    const newBook = await BookSchema.create({
      title,
      author,
      image: filename,
      category,
      price,
      description,
    });

    console.log(newBook);
    // Respond with the created book details
    res.status(201).json({
      status: "success",
      data: {
        book: newBook,
      },
    });
  } catch (error) {
    console.error("Error during book creation:", error);
    // Handle the error or respond with an error status
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
}

async function getOneBook(req, res, next) {
  try {
    const Userid = req.params.id;
    const UserData = await BookSchema.findById(Userid);
    res.json({
      status: "success",
      data: UserData,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
}

// async function deleteBook(req, res, next) {
//   try {
//     const Userid = req.params.id;
//     const Userdata = await BookSchema.findOneAndDelete(Userid);
//     res.json({
//       status: "success",
//       data: Userdata,
//     });
//   } catch (error) {
//     console.log(error);
//     next(error);
//   }
// }

async function deleteBook(req, res, next) {
  try {
    const bookId = req.params.id;
    const bookData = await BookSchema.findByIdAndDelete(bookId);

    if (!bookData) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }

    res.json({
      status: "success",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
}

async function UpdateBookData(req, res, next) {
  try {
    const Userid = req.params.id;
    let { title, author, category, image, price, description } = req.body;
    const filename = req.filename;
    console.log(filename);
    //const { path } = req.file;

    const updatedData = { title, author, category, price, image, description };
    if (filename) {
      updatedData.image = filename;
    }

    const Userdata = await BookSchema.findByIdAndUpdate(Userid, updatedData, {
      new: true,
    });

    res.status(201).json({
      status: "success",
      data: {
        user: Userdata,
      },
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
}

module.exports = {
  getBook,
  getOneBook,
  createNewBook,
  deleteBook,
  UpdateBookData,
};
