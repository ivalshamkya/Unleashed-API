import { web } from "./application/web.js";
import { logger } from "./application/logging.js";

const PORT = process.env.PORT;
web.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});