const admin = require("firebase-admin");
const db = admin.firestore();
const jwt = require("jsonwebtoken");

const secret = "secret"; // Debe ser la misma clave utilizada al firmar el token

exports.createItem = async (req, res) => {
  /* 
    #swagger.tags = ['Items']
    #swagger.description = 'Create an item'
    #swagger.summary = 'Create an item'
    #swagger.parameters['data'] = {
      in: 'body',
      description: 'Data to create an item',
      required: true,
    }
    #swagger.parameters['token'] = {
      in: 'header',
      description: 'JWT Token',
      required: true,
    }
    #swagger.responses[201] = {
      description: 'Item successfully created',
    }
    #swagger.responses[400] = {
      description: 'Bad request',
    }
  */

  const token = req.headers["token"];
  if (!token) {
    return res.status(400).send("Token no proporcionado");
  }

  try {
    const decoded = jwt.verify(token, secret);
    console.log("Token valido:", decoded);

    const data = req.body;
    const itemRef = await db.collection("items").add(data);
    res.status(201).send(`Created a new item: ${itemRef.id}`);
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      // Token ha expirado
      return res.status(408).send("El token ha expirado");
    } else {
      // Otro error
      return res.status(400).send(error.message);
    }
  }
};

exports.getAllItems = async (req, res) => {
  /* 
    #swagger.tags = ['Items']
    #swagger.description = 'Get all items entries'
    #swagger.summary = 'Get all items entries'
    #swagger.parameters['token'] = {
      in: 'header',
      description: 'JWT Token',
      required: true,
    }
    #swagger.responses[200] = {
      description: 'Items entries successfully obtained',
    }
    #swagger.responses[400] = {
      description: 'Bad request',
    }
  */

  const token = req.headers["token"];
  if (!token) {
    return res.status(400).send("Token no proporcionado");
  }

  try {
    const decoded = jwt.verify(token, secret);
    console.log("Token valido:", decoded);

    const itemsSnapshot = await db.collection("items").get();
    const items = [];
    itemsSnapshot.forEach((doc) => items.push({ id: doc.id, ...doc.data() }));
    res.status(200).json(items);
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      // Token ha expirado
      return res.status(408).send("El token ha expirado");
    } else {
      // Otro error
      return res.status(400).send(error.message);
    }
  }
};

exports.getItem = async (req, res) => {
  /* 
    #swagger.tags = ['Items']
    #swagger.description = 'Get an item entry'
    #swagger.summary = 'Get an item entry'
    #swagger.parameters['id'] = {
      description: 'Item id',
      required: true,
    }
    #swagger.parameters['token'] = {
      in: 'header',
      description: 'JWT Token',
      required: true,
    }
    #swagger.responses[404] = {
      description: 'Item not found',
    }
    #swagger.responses[400] = {
      description: 'Bad request',
    }
    #swagger.responses[200] = {
      description: 'Get an item by id',
    }
  */

  const token = req.headers["token"];
  if (!token) {
    return res.status(400).send("Token no proporcionado");
  }

  try {
    const decoded = jwt.verify(token, secret);
    console.log("Token valido:", decoded);

    const itemId = req.params.id;
    const itemDoc = await db.collection("items").doc(itemId).get();
    if (!itemDoc.exists) {
      res.status(404).send("Item not found");
    } else {
      res.status(200).json({ id: itemDoc.id, ...itemDoc.data() });
    }
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      // Token ha expirado
      return res.status(408).send("El token ha expirado");
    } else {
      // Otro error
      return res.status(400).send(error.message);
    }
  }
};

exports.updateItem = async (req, res) => {
  /* 
    #swagger.tags = ['Items']
    #swagger.description = ''
    #swagger.summary = ''
    #swagger.parameters['id'] = {
      description: '',
      required: true,
    }
    #swagger.parameters['data'] = {
      in: 'body',
      description: '',
      required: true,
    }
    #swagger.parameters['token'] = {
      in: 'header',
      description: 'JWT Token',
      required: true,
    }
    #swagger.responses[200] = {
      description: '',
    }
    #swagger.responses[400] = {
      description: '',
    }
  */

  const token = req.headers["token"];
  if (!token) {
    return res.status(400).send("Token no proporcionado");
  }

  try {
    const decoded = jwt.verify(token, secret);
    console.log("Token valido:", decoded);

    const itemId = req.params.id;
    const data = req.body;
    const itemRef = db.collection("items").doc(itemId);
    await itemRef.update(data);
    res.status(200).send("item updated");
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      // Token ha expirado
      return res.status(408).send("El token ha expirado");
    } else {
      // Otro error
      return res.status(400).send(error.message);
    }
  }
};

exports.deleteItem = async (req, res) => {
  /* 
    #swagger.tags = ['Items']
    #swagger.description = ''
    #swagger.summary = ''
    #swagger.parameters['id'] = {
      description: '',
      required: true,
    }
    #swagger.parameters['token'] = {
      in: 'header',
      description: 'JWT Token',
      required: true,
    }
    #swagger.responses[200] = {
      description: '',
    }
    #swagger.responses[400] = {
      description: '',
    }
  */

  const token = req.headers["token"];
  if (!token) {
    return res.status(400).send("Token no proporcionado");
  }

  try {
    const decoded = jwt.verify(token, secret);
    console.log("Token valido:", decoded);

    const itemId = req.params.id;
    await db.collection("items").doc(itemId).delete();
    res.status(200).send("Item Detected");
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      // Token ha expirado
      return res.status(408).send("El token ha expirado");
    } else {
      // Otro error
      return res.status(400).send(error.message);
    }
  }
};
