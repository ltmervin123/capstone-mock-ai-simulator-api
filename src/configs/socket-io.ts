import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import logger from '../utils/logger';
import { createTranscriptionSession } from '../third-parties/speech-to-text';
import { verifyToken } from '../utils/jwt';
import { AuthenticatedUserType } from '../types/auth-type';
import { UnauthorizedError } from '../utils/errors';
import { CorsOptions } from 'cors';

interface UserConnection {
  socketId: string;
  userId: string;
  userInfo: AuthenticatedUserType;
}

class SocketService {
  private io: Server | null = null;
  private activeConnections: UserConnection[] = [];
  public initialize(httpServer: HttpServer, corsOptions: CorsOptions): void {
    this.io = new Server(httpServer, {
      cors: corsOptions,
      path: '/socket.io',
      maxHttpBufferSize: 5e6,
      pingTimeout: 120000,
      pingInterval: 30000,
    });

    this.authenticateConnection();
    this.setupConnectionHandlers();
    logger.info('Socket.IO initialized');
  }

  private authenticateConnection(): void {
    this.io!.use((socket, next) => {
      try {
        const cookies = socket.handshake.headers.cookie;
        if (!cookies) {
          throw new UnauthorizedError('Authentication required');
        }

        const cookieObj: Record<string, string> = {};
        cookies.split(';').forEach((cookie) => {
          const [key, value] = cookie.trim().split('=');
          cookieObj[key] = value;
        });

        const authToken = cookieObj['authToken'];

        if (!authToken) {
          throw new UnauthorizedError('Authentication token is required');
        }

        const decoded = verifyToken(authToken) as AuthenticatedUserType;

        logger.info(`Socket authenticated for user: ${decoded._id}`);

        (socket as any).user = decoded;
        next();
      } catch (error) {
        logger.error(`Socket authentication failed: ${(error as Error).message}`);
        next(error as Error);
      }
    });
  }

  private setupConnectionHandlers(): void {
    if (!this.io) return;

    this.io.on('connection', (socket: Socket) => {
      const user = (socket as any).user as AuthenticatedUserType;
      const userId = user._id;

      logger.info(`Authenticated user connected: ${userId} (${user.firstName} ${user.lastName})`);

      this.activeConnections.push({
        socketId: socket.id,
        userId: userId,
        userInfo: user,
      });

      createTranscriptionSession(socket);

      // socket.on('start-transcription', () => {
      //   logger.info(`Starting transcription session for user: ${userId}`);

      //   createTranscriptionSession(socket);
      //   socket.emit('transcription-status', { status: 'initialized' });
      // });

      // Disconnect handler
      socket.on('disconnect', () => {
        logger.info(`User disconnected: ${userId}`);
        this.activeConnections = this.activeConnections.filter(
          (conn) => conn.socketId !== socket.id
        );
      });
    });
  }
}

// Create a singleton instance
export const socketService = new SocketService();
