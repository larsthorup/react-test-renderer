# @larsthorup/react-test-renderer

A custom React renderer for faster testing of React components

## Install

```sh
npm install @larsthorup/react-test-renderer
```

## Use

Import:

```tsx
import { TestRenderer } from '@larsthorup/react-test-renderer';
```

Render:

```tsx
const renderer = await TestRenderer.create(<App />);
```

Find by text, type or props:

```tsx
// return object if found
expect(renderer.findByType('div')).toBeDefined();

// return undefined if not found
expect(renderer.findByType('blink')).not.toBeDefined();

// find by text
expect(renderer.findByText('Save').type).toBe('button');

// find all
expect(renderer.findAllByProps({ type: 'checkbox' })).toHaveLength(5);
```

Inspect type and props:

```tsx
expect(renderer.findByProps({ placeholder: 'title' }).type).toBe('input');
expect(renderer.findByProps({ placeholder: 'title' }).props.value).toBe('Swim');
```

Trigger event handlers:

```tsx
import { change, click, submit } from "@larsthorup/react-test-renderer";
...
await click(renderer.findByText("Login"));
await change(renderer.findByProps({ placeholder: 'password' }), { target: { value: 'secret' } });
await submit(renderer.findByType('form'), { preventDefault: () => {} });
```

## Publish

```
npm version minor
npm publish
git push
```
