import db from "../db";
import { postUser, getUser, editUser } from "../db/model";

export default function handler(req, res) {
  if (req.method === "POST") {
    const { user_id, zipcode, size, energy, f_people, f_dogs, photo, name } =
      req.body;
    const values = [
      user_id,
      zipcode,
      size,
      energy,
      f_people,
      f_dogs,
      photo,
      name,
    ];
    return db
      .queryAsync(postUser, values)
      .then(() => res.status(200).send("post user to database"))
      .catch((err) => {
        console.log(err);
        res.status(500).send(err);
      });
  } else if (req.method === "GET") {
    return db
      .queryAsync(getUser, [req.query.user_id])
      .then((result) => res.status(200).send(result[0].rows))
      .catch((err) => {
        console.log(err);
        res.status(500).send(err);
      });
  } else if (req.method === "PUT") {
    const { user_id, zipcode, size, energy, f_people, f_dogs, photo, name } =
      req.body;
    const values = [
      user_id,
      zipcode,
      size,
      energy,
      f_people,
      f_dogs,
      photo,
      name,
    ];
    return db
      .queryAsync(editUser, values)
      .then(() => res.status(200).send("edit user in postgres"))
      .catch((err) => {
        console.log(err);
        res.status(500).send(err);
      });
  } else {
    res.status(404).send("Invalid Request");
  }

}
