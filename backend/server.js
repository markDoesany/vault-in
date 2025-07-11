import app from "./src/app.js";
import { testDBConnection } from "./src/utils/helpers.js";

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await testDBConnection();
    console.log('✅ Database connection successful!');
    
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
