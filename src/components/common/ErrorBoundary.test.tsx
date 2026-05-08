/**
 * Error Boundary Components Tests
 *
 * Tests for error boundary functionality
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  ErrorBoundary,
  AppErrorBoundary,
  SectionErrorBoundary,
  ComponentErrorBoundary,
} from './ErrorBoundary';

// Component that throws an error
function ThrowError({ shouldThrow = true }: { shouldThrow?: boolean }) {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>No error</div>;
}

describe('ErrorBoundary', () => {
  // Suppress console errors in tests
  const originalError = console.error;
  beforeAll(() => {
    console.error = vi.fn();
  });

  afterAll(() => {
    console.error = originalError;
  });

  describe('ErrorBoundary (generic)', () => {
    it('should render children when no error occurs', () => {
      render(
        <ErrorBoundary>
          <div>Test content</div>
        </ErrorBoundary>
      );

      expect(screen.getByText('Test content')).toBeInTheDocument();
    });

    it('should render fallback when error occurs', () => {
      render(
        <ErrorBoundary level="component">
          <ThrowError />
        </ErrorBoundary>
      );

      expect(screen.getByText(/Este componente não pôde ser carregado/i)).toBeInTheDocument();
    });

    it('should use app-level fallback when level is app', () => {
      render(
        <ErrorBoundary level="app">
          <ThrowError />
        </ErrorBoundary>
      );

      expect(screen.getByText(/Algo deu errado/i)).toBeInTheDocument();
    });

    it('should use section-level fallback when level is section', () => {
      render(
        <ErrorBoundary level="section">
          <ThrowError />
        </ErrorBoundary>
      );

      expect(screen.getByText(/Erro ao carregar esta seção/i)).toBeInTheDocument();
    });
  });

  describe('AppErrorBoundary', () => {
    it('should render children when no error occurs', () => {
      render(
        <AppErrorBoundary>
          <div>App content</div>
        </AppErrorBoundary>
      );

      expect(screen.getByText('App content')).toBeInTheDocument();
    });

    it('should render app-level fallback when error occurs', () => {
      render(
        <AppErrorBoundary>
          <ThrowError />
        </AppErrorBoundary>
      );

      expect(screen.getByText(/Algo deu errado/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Tentar novamente/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /Voltar ao início/i })).toBeInTheDocument();
    });
  });

  describe('SectionErrorBoundary', () => {
    it('should render children when no error occurs', () => {
      render(
        <SectionErrorBoundary sectionId="test-section">
          <div>Section content</div>
        </SectionErrorBoundary>
      );

      expect(screen.getByText('Section content')).toBeInTheDocument();
    });

    it('should render section-level fallback when error occurs', () => {
      render(
        <SectionErrorBoundary sectionId="test-section">
          <ThrowError />
        </SectionErrorBoundary>
      );

      expect(screen.getByText(/Erro ao carregar esta seção/i)).toBeInTheDocument();
    });

    it('should reset when sectionId changes', () => {
      const { rerender } = render(
        <SectionErrorBoundary sectionId="section-1">
          <ThrowError shouldThrow={false} />
        </SectionErrorBoundary>
      );

      expect(screen.getByText('No error')).toBeInTheDocument();

      // Change section ID - should reset boundary
      rerender(
        <SectionErrorBoundary sectionId="section-2">
          <ThrowError shouldThrow={false} />
        </SectionErrorBoundary>
      );

      expect(screen.getByText('No error')).toBeInTheDocument();
    });
  });

  describe('ComponentErrorBoundary', () => {
    it('should render children when no error occurs', () => {
      render(
        <ComponentErrorBoundary componentName="TestComponent">
          <div>Component content</div>
        </ComponentErrorBoundary>
      );

      expect(screen.getByText('Component content')).toBeInTheDocument();
    });

    it('should render component-level fallback when error occurs', () => {
      render(
        <ComponentErrorBoundary componentName="TestComponent">
          <ThrowError />
        </ComponentErrorBoundary>
      );

      expect(screen.getByText(/Este componente não pôde ser carregado/i)).toBeInTheDocument();
    });

    it('should allow retry', async () => {
      const user = userEvent.setup();

      render(
        <ComponentErrorBoundary componentName="TestComponent">
          <ThrowError />
        </ComponentErrorBoundary>
      );

      expect(screen.getByText(/Este componente não pôde ser carregado/i)).toBeInTheDocument();

      // Verify retry button exists and is clickable
      const retryButton = screen.getByRole('button', { name: /Tentar novamente/i });
      expect(retryButton).toBeInTheDocument();
      
      // Click should not throw
      await user.click(retryButton);
    });
  });
});
