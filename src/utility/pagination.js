import "jquery";
import { Subject } from "rxjs";

export default class Pagination {
  total = 0;
  pagePerItems = 0;
  currentPageIndex = 0;
  numOfPages = -1;

  #pgContainer = null;
  btnPrevRef;
  btnNextRef;
  counterRef;

  #pageChange = new Subject();

  get pageChange() {
    return this.#pageChange;
  }
  get offset() {
    return ((this.currentPageIndex) * this.pagePerItems) + 1;
  }
  set pgContainer(paginationContainerRef) {
    this.#pgContainer = paginationContainerRef;
  }

  constructor(total, pagePerItems) {
    this.total = total;
    this.pagePerItems = pagePerItems;
    this.calNumberOfPages();
  }

  calNumberOfPages() {
    this.numOfPages = Math.ceil(this.total / this.pagePerItems);
  }

  render() {
    if (!this.#pgContainer) return;

    let navRef = $.parseHTML(
      `<nav aria-label=""><ul class="pagination"></ul></nav>`
    );
    let ul = $(navRef).find("ul");

    /** Btn Pref */
    this.btnPrevRef = $.parseHTML(
      `<li class="page-item" role="button">
        <a class="page-link">
          <span aria-hidden="true">&laquo;</span>
        </a>
      </li>`
    );
    if (this.currentPageIndex == 0) {
      $(this.btnPrevRef).addClass("disabled");
    }
    $(this.btnPrevRef).on("click", (e) => {
      this.onClickBtnPrev(e);
    });
    $(ul).append(this.btnPrevRef);
    /** Btn Next */
    this.btnNextRef = $.parseHTML(
      `<li class="page-item" role="button">
        <a class="page-link">
          <span aria-hidden="true">&raquo;</span>
        </a>
      </li>`
    );
    if (this.currentPageIndex == this.numOfPages - 1) {
      $(this.btnNextRef).addClass("disabled");
    }
    $(this.btnNextRef).on("click", (e) => {
      this.onClickBtnNext(e);
    });
    $(ul).append(this.btnNextRef);
    /** Counter */
    this.counterRef = $.parseHTML(
      `<li class="d-flex align-items-center px-3">
          <span id="pagination-inner-counter">${this.currentPageIndex + 1} / ${
        this.numOfPages
      }</span>
      </li>`
    );
    $(ul).append(this.counterRef);

    $(this.#pgContainer).html(navRef);
  }

  onClickBtnPrev(event) {
    if (this.currentPageIndex == 0) return;
    this.currentPageIndex--;
    const countString = `${this.currentPageIndex + 1} / ${this.numOfPages}`;
    $(this.counterRef).find("#pagination-inner-counter").html(countString);
    if (this.currentPageIndex == 0) {
      $(this.btnPrevRef).addClass("disabled");
    }
    $(this.btnNextRef).removeClass("disabled");

    this.#pageChange.next({curPageIndex:this.currentPageIndex, offset: this.offset});
  }

  onClickBtnNext(event) {
    if (this.currentPageIndex == this.numOfPages - 1) return;
    this.currentPageIndex++;
    const countString = `${this.currentPageIndex + 1} / ${this.numOfPages}`;
    $(this.counterRef).find("#pagination-inner-counter").html(countString);
    if (this.currentPageIndex == this.numOfPages - 1) {
      $(this.btnNextRef).addClass("disabled");
    }
    $(this.btnPrevRef).removeClass("disabled");

    this.#pageChange.next({curPageIndex:this.currentPageIndex, offset: this.offset});

  }

  
}
