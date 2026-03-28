import { LikeRepository } from '../repositories/like.repository.js';
import { CommentRepository } from '../repositories/comment.repository.js';
import { NotificationRepository } from '../repositories/notification.repository.js';
import { SnippetRepository } from '../repositories/snippet.repository.js';
import { NotificationType } from '@prisma/client';

export const InteractionService = {
  async toggleLike(userId: string, snippetId: string) {
    const snippet = await SnippetRepository.findById(snippetId);
    if (!snippet) throw new Error('Snippet not found');

    const existingLike = await LikeRepository.find(userId, snippetId);

    if (existingLike) {
      await LikeRepository.delete(userId, snippetId);
      return { liked: false };
    } else {
      await LikeRepository.create(userId, snippetId);

      // Create notification
      if (snippet.authorId !== userId) {
        await NotificationRepository.create({
          recipientId: snippet.authorId,
          actorId: userId,
          type: NotificationType.LIKE,
          targetId: snippetId,
        });
      }
      return { liked: true };
    }
  },

  async addComment(data: {
    content: string;
    authorId: string;
    snippetId: string;
    parentCommentId?: string;
  }) {
    const snippet = await SnippetRepository.findById(data.snippetId);
    if (!snippet) throw new Error('Snippet not found');

    const comment = await CommentRepository.create(data);

    // Create notification for snippet owner
    if (snippet.authorId !== data.authorId) {
      await NotificationRepository.create({
        recipientId: snippet.authorId,
        actorId: data.authorId,
        type: data.parentCommentId ? NotificationType.REPLY : NotificationType.COMMENT,
        targetId: data.snippetId,
      });
    }

    return comment;
  },

  async getNotifications(userId: string) {
    return NotificationRepository.findByRecipient(userId);
  },

  async markNotificationRead(id: string, userId: string) {
    // Basic verification could be added here to ensure id belongs to userId
    return NotificationRepository.markAsRead(id);
  },
};
