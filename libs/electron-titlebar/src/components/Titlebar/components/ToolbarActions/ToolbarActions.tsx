import type { ToolbarActionsProps } from './types';
import { ToolbarActionItem } from './ToolbarActionItem';
import { ActionsContainer, ActionSeparator } from './styles';

export function ToolbarActions({ actions, renderActions }: ToolbarActionsProps) {
  const hasActions = actions && actions.length > 0;
  const hasCustom = typeof renderActions === 'function';

  if (!hasActions && !hasCustom) return null;

  return (
    <>
      <ActionSeparator />
      <ActionsContainer role="toolbar" aria-label="Toolbar actions">
        {hasActions &&
          actions.map((action) => (
            <ToolbarActionItem key={action.id} action={action} />
          ))}
        {hasCustom && renderActions()}
      </ActionsContainer>
    </>
  );
}
