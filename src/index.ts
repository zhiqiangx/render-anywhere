import React, { ReactElement } from 'react';
import ReactDOM from 'react-dom';

const ANYWHERE_ROOT_ID = 'anywhere-root';

const getPortalRoot = (id: string): HTMLElement => {
  let portalRoot: HTMLElement | null = document.getElementById(id);
  if (!portalRoot) {
    portalRoot = document.createElement('div');
    portalRoot.setAttribute('id', id);
    document.body.appendChild(portalRoot);
  }
  return portalRoot;
};

const anywhereRoot: HTMLElement = getPortalRoot(ANYWHERE_ROOT_ID);

export const createContainer = (): HTMLDivElement => {
  const div = document.createElement('div');
  anywhereRoot.appendChild(div);
  return div;
};

export type UnmountFunction = () => void;
export type UpdateFunction = (nextNode: ReactElement) => void;

export interface RenderAnywhereRet {
  unmount: UnmountFunction;
  update: UpdateFunction;
}

const renderAnywhere = (
  node: ReactElement,
  container?: HTMLElement
): RenderAnywhereRet => {
  const containerDom = container || createContainer();

  const unmount: UnmountFunction = () => {
    ReactDOM.unmountComponentAtNode(containerDom);
    if (!container) {
      anywhereRoot.removeChild(containerDom);
    }
  };

  const update: UpdateFunction = (nextNode) => {
    ReactDOM.render(nextNode, containerDom);
  }

  ReactDOM.render(node, containerDom);

  return { unmount, update };
};

interface RenderAnywhereRetRef {
  current?: RenderAnywhereRet | undefined;
}

export const renderAnywhereWithPromise = (node: ReactElement, container?: HTMLElement) => {
  const promise = new Promise((resolve) => {
    const ref: RenderAnywhereRetRef = { current: undefined };

    const close = (data) => {
      if (!ref.current) return;
      ref.current.unmount();
      resolve(data);
    };

    const realNode = React.isValidElement(node)
      ? React.cloneElement(node, {
          ...node.props,
          close,
        })
      : node;
    
    ref.current = renderAnywhere(realNode, container);
    return { promise, close, update: ref.current.update };
  });
};

export default renderAnywhere;
