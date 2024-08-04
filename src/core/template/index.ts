// File: src/core/template/index.ts
import ejs from "ejs";
import path from "path";

const EmailTemplate = {
  EMployeeNotif: async (
    userName: string,
    bookTitle: string,
    returnDate: string
  ) => {
    try {
      const html = await ejs.renderFile(path.join(__dirname, "employee.ejs"), {
        userName,
        bookTitle,
        returnDate
      });
      return html;
    } catch (error) {
      console.error("Error rendering Reminder template:", error);
      return "";
    }
  },
  adminNotif: async (
    userName: string,
    bookTitle: string
  ) => {
    try {
      const html = await ejs.renderFile(path.join(__dirname, "admin.ejs"), {
        userName,
        bookTitle
      });
      return html;
    } catch (error) {
      console.error("Error rendering Book Available template:", error);
      return "";
    }
  },
};

export default EmailTemplate;