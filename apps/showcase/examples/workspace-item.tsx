import { WorkspaceItem } from '@/registry/nativewind/components/ui/workspace-item';
import type { Preview } from '@showcase/components/component-page';
import { PreviewStack, Spec } from '@showcase/components/spec';
import * as React from 'react';

function Trailing() {
  return (
    <PreviewStack>
      <Spec label="◆ Trailing=More · Show plan">
        <WorkspaceItem name="Lumin PDF" plan="Free" trailing="more" onPress={() => {}} />
      </Spec>
      <Spec label="◆ Trailing=Join (primary)">
        <WorkspaceItem name="Marketing" trailing="join" />
      </Spec>
      <Spec label="◆ Trailing=Accept invite (secondary)">
        <WorkspaceItem name="Partner workspace" trailing="accept-invite" />
      </Spec>
      <Spec label="◆ Trailing=Request access (outline)">
        <WorkspaceItem name="Finance" trailing="request-access" />
      </Spec>
      <Spec label="◆ Trailing=None · Show subtitle">
        <WorkspaceItem name="Design team" plan="Business" subtitle="12 members" trailing="none" />
      </Spec>
    </PreviewStack>
  );
}

export const previews: Preview[] = [{ name: 'Trailing', component: Trailing }];
