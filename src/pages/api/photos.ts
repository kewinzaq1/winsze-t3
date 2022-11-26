import { type NextApiRequest, type NextApiResponse } from "next";
import formidable from "formidable";
import { prisma } from "../../server/db/client";
import fs from "fs";
import { storageClient } from "src/server/storage/supabase";
const srcToFile = (src: string) => fs.readFileSync(src);

const examples = async (req: NextApiRequest, res: NextApiResponse) => {
  const form = formidable({ multiples: true });
  form.parse(req, async function (err, fields, files) {
    // saveFile(files.file);
    console.log(files);
    console.log(srcToFile(files.avatar[0].filepath));

    const { data, error } = await storageClient
      .from("avatars")
      .upload("dsfsfsf", srcToFile(files.avatar[0].filepath) as any, {
        cacheControl: "3600",
        contentType: "image/png",
      });
    console.log({ data, error });
  });

  //   const saveFile = async (file: any) => {
  //     const data = fs.readFileSync(file.path);
  //     console.log(data);
  //     fs.writeFileSync(`./public/${file.name}`, data);
  //     await fs.unlinkSync(file.path);
  //     return;
  //   };

  return res.status(200).json({ message: "Hello World" });
};

export default examples;

export const config = {
  api: {
    bodyParser: false,
  },
};
