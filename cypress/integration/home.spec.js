describe('Home', () => {
  it('should have the default layout', () => {
    cy.visit('/');

    // Should redirect to /f
    cy.location('pathname').should('eq', '/f');

    // Should have the Dcard logo
    cy.findByRole('img', { name: 'Dcard' })
      .should('exist')
      .closest('a')
      .should('have.attr', 'href', '/f');

    // Should have the "所有看板" and "即時熱門看板" links
    cy.findByRole('link', { name: '所有看板' })
      .should('exist')
      .should('have.attr', 'href', '/forum/all');
    cy.findByRole('link', { name: '即時熱門看板' })
      .should('exist')
      .should('have.attr', 'href', '/forum/popular');

    // Should have the side bars with popular and selected forums
    function testForumItem($el) {
      const title = $el.attr('title');
      const text = $el.text();
      const href = $el.attr('href');
      expect(text).to.equal(title);
      expect(href).to.match(/^\/f\/[\w-_]+/);
    }

    cy.findByRole('region', { name: '即時熱門看板' })
      .should('exist')
      .within(() => {
        cy.findAllByRole('listitem')
          .should('have.length', 9)
          .findAllByRole('link')
          .each(($el, index) => {
            if (index < 8) {
              testForumItem($el);
            } else {
              expect($el.text()).to.equal('更多');
            }
          });
      });

    cy.findByRole('region', { name: 'Dcard 精選看板' })
      .should('exist')
      .within(() => {
        cy.findAllByRole('listitem')
          .should('have.length', 14)
          .findAllByRole('link')
          .each(testForumItem);
      });
  });

  it('should load the posts feed', () => {
    cy.visit('/');

    // There's a "全部" tab
    cy.findByRole('link', { name: '全部' })
      .should('exist')
      .should('have.attr', 'href', '/f');

    // There's a popular posts feed
    cy.findByRole('feed')
      .should('have.attr', 'aria-busy', 'false')
      .within(() => {
        cy.findAllByRole('article').each(($el, index) => {
          expect($el.attr('aria-posinset')).to.equal(String(index + 1));
          expect($el.attr('aria-setsize')).to.equal('30');
          const labelledBy = $el.attr('aria-labelledby');
          cy.get(`#${labelledBy}`).should('exist').should('not.be.empty');

          if (index === 0) {
            cy.get(`#${labelledBy}`).invoke('text').as('firstArticleTitle');
          }
        });
      });

    // Switch from "熱門" to "最新"
    // TODO: Should it be a combobox or a button?
    cy.findByRole('button', { name: '熱門' }).realClick();
    // testing-library cannot correctly fetch menu by its label name, skipping it.
    cy.findByRole('menu').should('have.focus');
    cy.realPress('ArrowDown');
    cy.findByRole('menuitem', { name: '熱門' }).should('have.focus');
    cy.realPress('ArrowDown');
    cy.findByRole('menuitem', { name: '最新' }).should('have.focus');
    cy.realPress('{enter}');
    cy.realPress('Tab');

    // There should be a latest posts feed
    cy.findByRole('feed')
      .should('have.attr', 'aria-busy', 'false')
      .within(() => {
        cy.findAllByRole('article').each(($el, index) => {
          expect($el.attr('aria-posinset')).to.equal(String(index + 1));
          expect($el.attr('aria-setsize')).to.equal('30');
          const labelledBy = $el.attr('aria-labelledby');
          cy.get(`#${labelledBy}`).should('exist').should('not.be.empty');

          if (index === 0) {
            cy.get(`#${labelledBy}`)
              .invoke('text')
              .should('not.eq', this.firstArticleTitle);
          }
        });
      });
  });
});
