import * as fs from "fs";
import { glob } from "glob";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

function generateZodSchema(value: any, name: string): string {
  if (value === null) {
    return `z.null()`;
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return `z.array(z.any())`;
    }
    const firstItem = value[0];
    const itemSchema = generateZodSchema(firstItem, `${name}Item`);
    return `z.array(${itemSchema})`;
  }

  if (typeof value === "object") {
    const entries = Object.entries(value);
    if (entries.length === 0) {
      return `z.object({})`;
    }

    const fields = entries
      .map(([key, val]) => {
        const isValidIdentifier = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key);
        const fieldName = isValidIdentifier ? key : `'${key}'`;
        const fieldSchema = generateZodSchema(
          val,
          `${name}${key.charAt(0).toUpperCase() + key.slice(1)}`
        );
        return `${fieldName}: ${fieldSchema}`;
      })
      .join(",\n    ");

    return `z.object({\n    ${fields}\n  })`;
  }

  switch (typeof value) {
    case "string":
      if (/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(value)) {
        return `z.string().email()`;
      }
      return `z.string()`;
    case "number":
      if (Number.isInteger(value)) {
        return `z.number().int()`;
      }
      return `z.number()`;
    case "boolean":
      return `z.boolean()`;
    default:
      return `z.any()`;
  }
}

async function generateSchemas() {
  const mockFiles = await glob("src/**/*.mock.json", { cwd: rootDir });

  for (const filePath of mockFiles) {
    try {
      const fullPath = path.resolve(rootDir, filePath);
      const fileContent = fs.readFileSync(fullPath, "utf-8");
      const json = JSON.parse(fileContent);

      const fileName = path.basename(filePath, ".mock.json");
      const schemaName =
        fileName.charAt(0).toUpperCase() + fileName.slice(1) + "Schema";

      const zodSchema = generateZodSchema(json, schemaName);
      const schemaPath = fullPath.replace(".mock.json", ".mock.schema.ts");

      const schemaContent =
        `import { z } from 'zod';\n\n` +
        `export const ${schemaName} = ${zodSchema};\n\n` +
        `export type ${schemaName}Type = z.infer<typeof ${schemaName}>;\n`;

      fs.writeFileSync(schemaPath, schemaContent);
    } catch (error) {
      console.error(`Error processing ${filePath}:`, error);
    }
  }

  console.log("Schema generation completed!");
}

generateSchemas().catch(console.error);
