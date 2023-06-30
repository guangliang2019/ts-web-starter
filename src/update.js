import format from "date-fns/format";
import a from "./test";

var span = document.querySelector("#time-now");

export default function update() {
  console.log(a);
  span.textContent = format(new Date(), "h:mm:ssa");
  setTimeout(update, 1000);
}
