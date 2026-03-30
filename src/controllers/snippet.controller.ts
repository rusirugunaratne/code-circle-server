import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.js';
import { SnippetService } from '../services/snippet.service.js';
import { CreateSnippetInput } from '../schemas/snippet.schema.js';

export const SnippetController = {
  async getFeed(req: Request, res: Response, next: NextFunction) {
    logger.debug({ query: req.query }, 'SnippetController.getFeed: Fetching feed');
    try {
      const { page, pageSize, tag, search, sort } = req.query;
      const snippets = await SnippetService.getFeed(
        page ? parseInt(page as string) : 1,
        pageSize ? parseInt(pageSize as string) : 10,
        tag as string,
        search as string,
        sort as string
      );
      res.json(snippets);
    } catch (error) {
      next(error);
    }
  },

  async getSnippet(req: Request, res: Response, next: NextFunction) {
    logger.debug({ snippetId: req.params.id }, 'SnippetController.getSnippet: Fetching snippet');
    try {
      const snippet = await SnippetService.getSnippet(req.params.id);
      res.json(snippet);
    } catch (error) {
      next(error);
    }
  },

  async createSnippet(req: Request<{}, {}, CreateSnippetInput>, res: Response, next: NextFunction) {
    logger.info({ userId: req.user?.id, title: req.body.title }, 'SnippetController.createSnippet: Creating snippet');
    try {
      if (!req.user) throw new Error('Unauthorized');

      const snippet = await SnippetService.createSnippet({
        ...req.body,
        authorId: req.user.id,
      });
      res.status(201).json(snippet);
    } catch (error) {
      next(error);
    }
  },

  async deleteSnippet(req: Request, res: Response, next: NextFunction) {
    logger.info({ snippetId: req.params.id, userId: req.user?.id }, 'SnippetController.deleteSnippet: Deleting snippet');
    try {
      if (!req.user) throw new Error('Unauthorized');

      await SnippetService.deleteSnippet(req.params.id, req.user.id, req.user.role);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
};
