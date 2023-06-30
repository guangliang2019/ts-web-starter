import a from "./test";

var root = document.querySelector("#app-root") as HTMLDivElement;

const stateList = {
  count: 1,
};
const refreshEventList = [] as (() => void)[];
const refresh = () => {
  refreshEventList.forEach((element) => {
    element();
  });
};

const stateProxy = new Proxy(stateList, {
  set(target, p, newValue, receiver) {
    return Reflect.set(target, p, newValue, receiver);
  },
});

const useReactData = <T extends object>(
  sourceData: T,
  onSetValue: () => any
): T => {
  return new Proxy(sourceData, {
    set(target, key, value) {
      // 在你执行 Proxy set 对应的 Reflect set 时，赋值行为就会完成
      const result = Reflect.set(target, key, value);
      onSetValue();
      return result;
    },
    get(target, key) {
      // 在你执行 Proxy get 对应的 Reflect get 时，读取行为就会完成
      return Reflect.get(target, key);
    },
  });
};

const proxyState = useReactData(stateList, refresh);
const handleClick = () => {
  console.log(proxyState.count++);
};
const eventList = {
  handleClick,
};

const template = `<h1 @click="handleClick" id="title" renderid="1">Hello, World</h1>`;
const template2 = `<div renderid="2">{{count}}</div>`;

const eventRex = /\@(.+?)\=\"(.+?)\"/g;
const renderIdRex = /(.+?)\=\"(.+?)\"/g;
const contentRex = /\{\{(.+?)\}\}/g;
export default function app() {
  console.log(a);
  const node1 = document.createElement("div");
  node1.id = "app";

  // 取得标记位置和 DOM 元素的对应关系
  // 是否绑定了事件
  node1.innerHTML = template;

  const node2 = document.createElement("div");
  node2.innerHTML = template2;
  // render
  root.appendChild(node1);
  root.appendChild(node2);

  const title = document.querySelector(`[renderid="1"]`) as HTMLElement;
  console.log(title?.attributes);
  console.log(
    title.addEventListener("click", eventList[title.attributes["@click"].value])
  );
  title.attributes.removeNamedItem("@click");

  const countDom = document.querySelector(`[renderid="2"]`) as HTMLElement;
  console.log(countDom.innerHTML);
  if (countDom.innerHTML.match(contentRex)) {
    // setup
    let contentKey = countDom.innerHTML.trim();
    contentKey = contentKey.slice(2, -2);
    // update
    const refreshNode2 = () => {
      countDom.innerHTML = stateList[contentKey];
    };
    refreshNode2();
    refreshEventList.push(refreshNode2);
  }
  console.log(title);

  console.log(root);
}
