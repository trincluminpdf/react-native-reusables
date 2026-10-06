import { ComponentPage } from '@showcase/components/component-page';
import { PREVIEWS } from '@showcase/examples';
import { COMPONENTS, getComponent } from '@showcase/lib/constants';
import { Redirect, Stack, useLocalSearchParams } from 'expo-router';
import * as React from 'react';

/** Pre-render every component page for the static web export. */
export async function generateStaticParams(): Promise<Record<string, string>[]> {
  return COMPONENTS.map((c) => ({ slug: c.slug }));
}

export default function ComponentScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const previews = slug ? PREVIEWS[slug] : undefined;
  if (!slug || !previews) return <Redirect href="/" />;
  return (
    <>
      <Stack.Screen options={{ title: getComponent(slug)?.name ?? slug }} />
      <ComponentPage slug={slug} previews={previews} />
    </>
  );
}
