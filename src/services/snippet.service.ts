import { SnippetRepository } from '../repositories/snippet.repository.js';
import { logger } from '../utils/logger.js';
import { Role } from '@prisma/client';

export const SnippetService = {
  async getFeed(page = 1, pageSize = 10, tag?: string, search?: string, sort?: string) {
    return SnippetRepository.getFeed(page, pageSize, tag, search, sort);
  },

  async getSnippet(id: string) {
    const snippet = await SnippetRepository.findById(id);
    if (!snippet) {
      logger.warn({ snippetId: id }, 'SnippetService.getSnippet: Snippet not found');
      const err: any = new Error('Snippet not found');
      err.status = 404;
      throw err;
    }
    return snippet;
  },

  async createSnippet(data: {
    title: string;
    description?: string;
    code: string;
    language: string;
    authorId: string;
    tags: string[];
  }) {
    return SnippetRepository.create(data);
  },

  async deleteSnippet(id: string, requesterId: string, requesterRole: Role) {
    const snippet = await SnippetRepository.findById(id);
    if (!snippet) {
      const err: any = new Error('Snippet not found');
      err.status = 404;
      throw err;
    }

    const isOwner = snippet.authorId === requesterId;
    const isAdmin = requesterRole === Role.ADMIN;

    if (!isOwner && !isAdmin) {
      logger.warn({ snippetId: id, requesterId }, 'SnippetService.deleteSnippet: Unauthorized delete attempt');
      const err: any = new Error('Forbidden: cannot delete this snippet');
      err.status = 403;
      throw err;
    }

    return SnippetRepository.delete(id);
  },
};
