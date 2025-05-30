// src/server.ts
// Configurations de Middlewares
import express from 'express';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { setupSwagger } from './swagger';
import morgan from 'morgan';
import { ONE_HUNDRED, SIXTY } from './core/constants';
import { routeEmployee } from './routes/employee.routes';
import { presenceRouter } from './routes/presence.routes';
import { absenceRouter } from './routes/abscence.routes';
import routerReport from './routes/report.routes';
import cookieParser from 'cookie-parser';
import routerNotif from './routes/notification.routes';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use(
	rateLimit({
		max: ONE_HUNDRED,
		windowMs: SIXTY,
		message: 'Trop de Requete à partir de cette adresse IP '
	})
);

app.use(morgan('combined'));
app.use(cookieParser())
// routes middleware
app.use("/employees",routeEmployee)
app.use("/attendance",presenceRouter) 
app.use("/",absenceRouter)
app.use("/reports",routerReport)
app.use("/notifications",routerNotif)

setupSwagger(app);
export default app;
