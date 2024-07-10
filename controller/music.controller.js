import pool from "../config/db.config.js";


export const singerPostController = async (req, res) => {
  try {
    const { name, country } = req.body;

    // Validate request data
    if (!name || !country) {
      return res.status(400).json({ error: "Name and country are required" });
    }

    // Check if singer with the same name already exists
    const [existingSingers] = await pool.query(
      "SELECT * FROM singers WHERE name = ?",
      [name]
    );

    if (existingSingers.length > 0) {
      return res.status(422).json({
        success: false,
        message: "Singer is already registered",
      });
    }

    // Insert singer data into the database
    const insertQuery = `INSERT INTO singers (name, country) VALUES (?, ?)`;
    const insertValues = [name, country];
    const [insertResult] = await pool.query(insertQuery, insertValues);

    if (insertResult.affectedRows > 0) {
      const newSinger = {
        singer_id: insertResult.insertId,
        name,
        country,
      };

      return res.status(201).json({
        success: true,
        message: "Singer created successfully",
        singer: newSinger,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Bad request",
      });
    }
  } catch (err) {
    console.error("Error creating singer:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
export const singerGetController = async (req, res) => {
    const id =req.params.id;
    if (!id){
        const getQuery = `SELECT * FROM singers`;
        const getResult=await pool.query(getQuery)
        console.log(getResult)
       return res.status(200).json({
         success: true,
         singers: getResult,
       });

    }
    else{
        const [resultbyid] = await pool.query(
          "SELECT * FROM singers WHERE singer_id = ?",
          [id]
        );
        console.log(resultbyid,"bvbbg")
         if (resultbyid.length!=0)return res.status(200).json({
           success: true,
           singers: resultbyid,
         });
         return res.status(400).json({
           success: false,
           message:"Not found"
           //singers: resultbyid,
         });


    }
    


}
export const singerDeleteController = async (req, res) => {
try {
  const id = req.params.id;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "ID parameter is required",
    });
  }

  // Query to delete the singer by ID
  const [result] = await pool.query("DELETE FROM singers WHERE singer_id = ?", [
    id,
  ]);

  if (result.affectedRows === 0) {
    return res.status(404).json({
      success: false,
      message: "Singer not found",
    });
  }

  return res.status(200).json({
    success: true,
    message: "Singer deleted successfully",
  });
} catch (err) {
  console.error("Error deleting singer by ID:", err);
  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
}
};


export const singerUpdateController = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, country } = req.body;

    // Validate request data
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID parameter is required",
      });
    }

    // Check if the singer exists
    const [existingSingers] = await pool.query(
      "SELECT * FROM singers WHERE singer_id = ?",
      [id]
    );

    if (existingSingers.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Singer not found",
      });
    }

    // Update singer data in the database
    let updateQuery = "UPDATE singers SET";
    const updateValues = [];

    if (name) {
      updateQuery += " name = ?,";
      updateValues.push(name);
    }

    if (country) {
      updateQuery += " country = ?,";
      updateValues.push(country);
    }

    // Remove the trailing comma from the query string
    updateQuery = updateQuery.slice(0, -1);

    updateQuery += " WHERE singer_id = ?";
    updateValues.push(id);

    const [updateResult] = await pool.query(updateQuery, updateValues);

    if (updateResult.affectedRows > 0) {
      return res.status(200).json({
        success: true,
        message: "Singer updated successfully",
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Failed to update singer",
      });
    }
  } catch (err) {
    console.error("Error updating singer:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};



export const albumPostController = async (req, res) => {
  try {
    const { title, release_year, singer_id } = req.body;

    // Validate request data
    if (!title || !release_year || !singer_id) {
      return res
        .status(400)
        .json({ error: "Title, release_year, and singer_id are required" });
    }

    //Check if album exists in the singers table
    const [existingSingers] = await pool.query(
      "SELECT * FROM albums WHERE title = ?",
      [title]
    );

    if (existingSingers.length != 0) {
      return res.status(404).json({
        success: false,
        message: "Album already exits",
      });
    }

    // Insert album data into the database
    const insertQuery = `
      INSERT INTO albums (title, release_year, singer_id)
      VALUES (?, ?, ?)
    `;
    const insertValues = [title, release_year, singer_id];
    const [insertResult] = await pool.query(insertQuery, insertValues);

    if (insertResult.affectedRows > 0) {
      const album_id = insertResult.insertId;

      return res.status(201).json({
        success: true,
        message: "Album added successfully",
        album_id: album_id,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Failed to add album",
      });
    }
  } catch (err) {
    console.error("Error adding album:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
export const albumGetController = async (req, res) => {
  const id = req.params.id;
  console.log("f")
  if (!id) {
    const getQuery = `SELECT * FROM albums`;
    const getResult = await pool.query(getQuery);
    console.log(getResult);
    return res.status(200).json({
      success: true,
      singers: getResult,
    });
  } else {
    const [resultbyid] = await pool.query(
      "SELECT * FROM albums WHERE album_id = ?",
      [id]
    );
    if(resultbyid.length!=0)return res.status(200).json({
      success: true,
      singers: resultbyid,
    });
    return res.status(400).json({
      success: false,
      message:"Not found"
      //singers: resultbyid,
    });
  }
};
export const albumGetControllerBysingerID = async (req, res) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID parameter is required",
      });
    }

    // Query albums by singer_id
    const [albums] = await pool.query(
      "SELECT * FROM albums WHERE singer_id = ?",
      [id]
    );

    if (albums.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No albums found for the specified singer ID",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Albums found",
      albums: albums,
    });
  } catch (err) {
    console.error("Error fetching albums by singer ID:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const albumDeleteController = async (req, res) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID parameter is required",
      });
    }

    // Query to delete the singer by ID
    const [result] = await pool.query(
      "DELETE FROM albums WHERE album_id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "album not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "The album deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting album by ID:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
export const albumUpdateController = async (req, res) => {
  try {
    const id = req.params.id;
    const { title,release_year} = req.body;

    // Validate request data
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID parameter is required",
      });
    }

    // Check if the singer exists
    const [existingalbums] = await pool.query(
      "SELECT * FROM albums WHERE album_id = ?",
      [id]
    );

    if (existingalbums.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Album not found",
      });
    }

    // Update singer data in the database
    let updateQuery = "UPDATE albums SET";
    const updateValues = [];

    if (title) {
      updateQuery += " title = ?,";
      updateValues.push(title);
    }

    if (release_year) {
      updateQuery += " release_year = ?,";
      updateValues.push(release_year);
    }

    // Remove the trailing comma from the query string
    updateQuery = updateQuery.slice(0, -1);

    updateQuery += " WHERE album_id = ?";
    updateValues.push(id);

    const [updateResult] = await pool.query(updateQuery, updateValues);

    if (updateResult.affectedRows > 0) {
      return res.status(200).json({
        success: true,
        message: "The Album updated successfully",
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Failed to update Album",
      });
    }
  } catch (err) {
    console.error("Error updating singer:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};



export const songPostController = async (req, res) => {
  try {
    const {  title, duration, album_id, singer_id } = req.body;

    // Validate request data
    if (!title || !duration || !album_id ||!singer_id) {
      return res
        .status(400)
        .json({ error: "Title, duration, album_id and singer_id are required" });
    }

    // Check if songs exists in the singers table
    const [existingsong] = await pool.query(
      "SELECT * FROM songs WHERE title = ?",
      [title]
    );

    console.log(existingsong)
    if (existingsong.length != 0) {
      return res.status(404).json({
        success: false,
        message: "Song Already exists",
      });
    }

    // Insert album data into the database
    const insertQuery = `
      INSERT INTO songs (title, duration, album_id, singer_id)
      VALUES (?, ?, ?,?)
    `;
    const insertValues = [title, duration,album_id, singer_id];
    const [insertResult] = await pool.query(insertQuery, insertValues);
    console.log(insertResult,"fyu")

    if (insertResult.affectedRows > 0) {
      const song_id = insertResult.insertId;

      return res.status(201).json({
        success: true,
        message: "Song added successfully",
        song_id: song_id,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Failed to add  song",
      });
    }
  } catch (err) {
    console.error("Error adding song:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const songGetControllerByalbumID = async (req, res) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID parameter is required",
      });
    }

    // Query albums by singer_id
    const [songs] = await pool.query(
      "SELECT * FROM songs WHERE album_id = ?",
      [id]
    );

    if (songs.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No songs found for the specified album ID",
      });
    }

    return res.status(200).json({
      success: true,
      message: "These are the songs from an Album Id",
      songs: songs,
    });
  } catch (err) {
    console.error("Error fetching songs by Album ID:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
export const songGetControllerBysingerID = async (req, res) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID parameter is required",
      });
    }

    // Query albums by singer_id
    const [songs] = await pool.query("SELECT * FROM songs WHERE singer_id = ?", [
      id,
    ]);

    if (songs.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No songs found for the specified singer ID",
      });
    }

    return res.status(200).json({
      success: true,
      message: "These are the songs from a Singer Id",
      songs: songs,
    });
  } catch (err) {
    console.error("Error fetching songs by Singer ID:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
export const songUpdateController = async (req, res) => {
  try {
    const id = req.params.id;
    const { title,duration } = req.body;

    // Validate request data
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID parameter is required",
      });
    }

    // Check if the singer exists
    const [existingongs] = await pool.query(
      "SELECT * FROM songs WHERE song_id = ?",
      [id]
    );

    if (existingongs.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Song not found",
      });
    }

    // Update singer data in the database
    let updateQuery = "UPDATE songs SET";
    const updateValues = [];

    if (title) {
      updateQuery += " title = ?,";
      updateValues.push(title);
    }

    if (duration) {
      updateQuery += " duration = ?,";
      updateValues.push(duration);
    }

    // Remove the trailing comma from the query string
    updateQuery = updateQuery.slice(0, -1);

    updateQuery += " WHERE song_id = ?";
    updateValues.push(id);

    const [updateResult] = await pool.query(updateQuery, updateValues);

    if (updateResult.affectedRows > 0) {
      return res.status(200).json({
        success: true,
        message: "The Song's info updated successfully",
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Failed to update Song",
      });
    }
  } catch (err) {
    console.error("Error updating Song:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const songGetController = async (req, res) => {
  const id = req.params.id;
  console.log("f");
  if (!id) {
    const getQuery = `SELECT * FROM songs`;
    const getResult = await pool.query(getQuery);
    console.log(getResult);
    return res.status(200).json({
      success: true,
      singers: getResult,
    });
  } else {
    const [resultbyid] = await pool.query(
      "SELECT * FROM songs WHERE song_id = ?",
      [id]
    );
    if(resultbyid.length!=0)return res.status(200).json({
      success: true,
      singers: resultbyid,
    });
    return res.status(400).json({
      success: false,
      message:"Not found"
      //singers: resultbyid,
    });
  }
};
export const songDeleteController = async (req, res) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID parameter is required",
      });
    }

    // Query to delete the singer by ID
    const [result] = await pool.query("DELETE FROM songs WHERE song_id = ?", [
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "song not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "The song deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting song by ID:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};