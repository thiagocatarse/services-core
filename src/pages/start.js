window.c.pages.Start = ((m, c, h, models, I18n) => {
    const I18nScope = _.partial(h.i18nScope, 'pages.start');

    return {
        controller: () => {
            const stats = m.prop([]),
                categories = m.prop([]),
                selectedPane = m.prop(0),
                selectedCategory = m.prop([]),
                featuredProjects = m.prop([]),
                selectedCategoryIdx = m.prop(-1),
                startvm = c.pages.startVM(I18n),
                categoryvm = m.postgrest.filtersVM({
                    category_id: 'eq'
                }),
                projectvm = m.postgrest.filtersVM({
                    project_id: 'eq'
                }),
                uservm = m.postgrest.filtersVM({
                    user_id: 'eq'
                }),
                filters = m.postgrest.filtersVM,
                paneImages = startvm.panes,
                statsLoader = m.postgrest.loaderWithToken(models.statistic.getRowOptions()),
                loadCategories = () => {
                    return c.models.category.getPageWithToken(filters({}).order({
                        name: 'asc'
                    }).parameters()).then(categories);
                },
                selectPane = (idx) => {
                    return () => {
                        selectedPane(idx);
                    };
                },
                lCategory = () => {
                    return m.postgrest.loaderWithToken(models.categoryTotals.getRowOptions(categoryvm.parameters()));
                },
                lProject = () => {
                    return m.postgrest.loaderWithToken(models.projectDetail.getRowOptions(projectvm.parameters()));
                },
                lUser = () => {
                    return m.postgrest.loaderWithToken(models.user.getRowOptions(uservm.parameters()));
                },
                selectCategory = (id) => {
                    return () => {
                        selectedCategoryIdx(id);
                        categoryvm.category_id(id);
                        selectedCategory([]);
                        m.redraw();
                        lCategory().load().then(loadCategoryProjects);
                    };
                },
                loadCategoryProjects = (category) => {
                    selectedCategory(category);
                    let categoryProjects = _.findWhere(startvm.categoryProjects, {
                        categoryId: _.first(category).category_id
                    });
                    featuredProjects([]);
                    if (!_.isUndefined(categoryProjects)) {
                        _.map(categoryProjects.projects, (project_id, idx) => {
                            projectvm.project_id(project_id);
                            lProject().load().then((project) => featuredProjects()[idx] = project);
                        });
                    }
                };

            statsLoader.load().then(stats);
            loadCategories();

            return {
                stats: stats,
                categories: categories,
                paneImages: paneImages,
                selectCategory: selectCategory,
                selectedCategory: selectedCategory,
                selectedCategoryIdx: selectedCategoryIdx,
                selectPane: selectPane,
                selectedPane: selectedPane,
                featuredProjects: featuredProjects,
                testimonials: startvm.testimonials,
                questions: startvm.questions
            };
        },
        view: (ctrl, args) => {
            let stats = _.first(ctrl.stats());
            const testimonials = () => {
                return _.map(ctrl.testimonials, (testimonial) => {
                    return m('.card.u-radius.card-big.card-terciary', [
                        m('.u-text-center.u-marginbottom-20', [
                            m(`img.thumb-testimonial.u-round.u-marginbottom-20[src="${testimonial.thumbUrl}"]`)
                        ]),
                        m('p.fontsize-large.u-marginbottom-30', `"${testimonial.content}"`),
                        m('.u-text-center', [
                            m('.fontsize-large.fontweight-semibold', testimonial.name),
                            m('.fontsize-base', testimonial.totals)
                        ])
                    ]);
                });

            };

            return [
                m('.w-section.hero-full.hero-start', [
                    m('.w-container.u-text-center', [
                        m('.fontsize-megajumbo.fontweight-semibold.u-marginbottom-40', I18n.t('slogan', I18nScope())),
                        m('.w-row.u-marginbottom-40', [
                            m('.w-col.w-col-4.w-col-push-4', [
                                m('a.btn.btn-large.u-marginbottom-10[href=\'/projects/new\']',  I18n.t('submit', I18nScope()))
                            ])
                        ]),
                        m('.w-row', _.isEmpty(stats) ? '' : [
                            m('.w-col.w-col-4', [
                                m('.fontsize-largest.lineheight-loose', h.formatNumber(stats.total_contributors, 0, 3)),
                                m('p.fontsize-small.start-stats', I18n.t('header.people', I18nScope()))
                            ]),
                            m('.w-col.w-col-4', [
                                m('.fontsize-largest.lineheight-loose', stats.total_contributed.toString().slice(0, 2) + ' milhões'),
                                m('p.fontsize-small.start-stats', I18n.t('header.money', I18nScope()))
                            ]),
                            m('.w-col.w-col-4', [
                                m('.fontsize-largest.lineheight-loose', h.formatNumber(stats.total_projects_success, 0, 3)),
                                m('p.fontsize-small.start-stats', I18n.t('header.success', I18nScope()))
                            ])
                        ])
                    ])
                ]),
                m('.w-section.section', [
                    m('.w-container', [
                        m('.w-row', [
                            m('.w-col.w-col-10.w-col-push-1.u-text-center', [
                                m('.fontsize-larger.u-marginbottom-10.fontweight-semibold', I18n.t('page-title', I18nScope())),
                                m('.fontsize-small', I18n.t('page-subtitle', I18nScope()))
                            ]),
                        ]),
                        m('.w-clearfix.how-row', [
                            m('.w-hidden-small.w-hidden-tiny.how-col-01', [
                                m('.info-howworks-backers', [
                                    m('.fontweight-semibold.fontsize-large', I18n.t('banner.1', I18nScope())),
                                    m('.fontsize-base', I18n.t('banner.2', I18nScope()))
                                ]),
                                m('.info-howworks-backers', [
                                    m('.fontweight-semibold.fontsize-large', I18n.t('banner.3', I18nScope())),
                                    m('.fontsize-base', I18n.t('banner.4', I18nScope()))
                                ])
                            ]),
                            m('.how-col-02'),
                            m('.how-col-03', [
                                m('.fontweight-semibold.fontsize-large', I18n.t('banner.5', I18nScope())),
                                m('.fontsize-base', I18n.t('banner.6', I18nScope())),
                                m('.fontweight-semibold.fontsize-large.u-margintop-30', I18n.t('banner.7', I18nScope())),
                                m('.fontsize-base', I18n.t('banner.8', I18nScope()))
                            ]),
                            m('.w-hidden-main.w-hidden-medium.how-col-01', [
                                m('.info-howworks-backers', [
                                    m('.fontweight-semibold.fontsize-large', I18n.t('banner.1', I18nScope())),
                                    m('.fontsize-base', I18n.t('banner.2', I18nScope()))
                                ]),
                                m('.info-howworks-backers', [
                                    m('.fontweight-semibold.fontsize-large', I18n.t('banner.3', I18nScope())),
                                    m('.fontsize-base',  I18n.t('banner.4', I18nScope()))
                                ]),
                                m('.info-howworks-backers', [
                                    m('.fontweight-semibold.fontsize-large', I18n.t('banner.5', I18nScope())),
                                    m('.fontsize-base',  I18n.t('banner.6', I18nScope()))
                                ]),
                                m('.info-howworks-backers', [
                                    m('.fontweight-semibold.fontsize-large', I18n.t('banner.7', I18nScope())),
                                    m('.fontsize-base',  I18n.t('banner.8', I18nScope()))
                                ])
                            ])
                        ])
                    ])
                ]),
                m('.w-section.divider'),
                m('.w-section.section-large', [
                    m('.w-container.u-text-center.u-marginbottom-60', [
                        m('div', [
                            m('span.fontsize-largest.fontweight-semibold', I18n.t('features.title', I18nScope()))
                        ]),
                        m('.w-hidden-small.w-hidden-tiny.fontsize-large.u-marginbottom-20', I18n.t('features.subtitle', I18nScope())),
                        m('.w-hidden-main.w-hidden-medium.u-margintop-30', [
                            m('.fontsize-large.u-marginbottom-30', I18n.t('features.feature_1', I18nScope())),
                            m('.fontsize-large.u-marginbottom-30', I18n.t('features.feature_2', I18nScope())),
                            m('.fontsize-large.u-marginbottom-30', I18n.t('features.feature_3', I18nScope())),
                            m('.fontsize-large.u-marginbottom-30', I18n.t('features.feature_4', I18nScope())),
                            m('.fontsize-large.u-marginbottom-30', I18n.t('features.feature_5', I18nScope()))
                        ])
                    ]),
                    m('.w-container', [
                        m('.w-tabs.w-hidden-small.w-hidden-tiny', [
                            m('.w-tab-menu.w-col.w-col-4', _.map(ctrl.paneImages, (pane, idx) => {
                                return m(`a.w-tab-link.w-inline-block.tab-list-item${(idx === ctrl.selectedPane()) ? '.selected' : ''}`, {
                                    onclick: ctrl.selectPane(idx)
                                }, pane.label);
                            })),
                            m('.w-tab-content.w-col.w-col-8', _.map(ctrl.paneImages, (pane, idx) => {
                                return m('.w-tab-pane', [
                                    m(`img[src="${pane.src}"].pane-image${(idx === ctrl.selectedPane()) ? '.selected' : ''}`)
                                ]);
                            }))
                        ])
                    ])
                ]),
                m('.w-section.section-large.bg-blue-one', [
                    m('.w-container.u-text-center', [
                        m('.fontsize-larger.lineheight-tight.fontcolor-negative.u-marginbottom-20', [
                            I18n.t('video.title', I18nScope()),
                            m('br'),
                            I18n.t('video.subtitle', I18nScope())
                        ]),
                        m.component(c.YoutubeLightbox, {
                            src: I18n.t('video.src', I18nScope())
                        })
                    ])
                ]),
                m('.w-hidden-small.w-hidden-tiny.section-categories', [
                    m('.w-container', [
                        m('.u-text-center', [
                            m('.w-row', [
                                m('.w-col.w-col-10.w-col-push-1', [
                                    m('.fontsize-large.u-marginbottom-40.fontcolor-negative', I18n.t('categories.title', I18nScope()))
                                ])
                            ])
                        ]),
                        m('.w-tabs', [
                            m('.w-tab-menu.u-text-center', _.map(ctrl.categories(), (category) => {
                                return m(`a.w-tab-link.w-inline-block.btn-category.small.btn-inline${(ctrl.selectedCategoryIdx() === category.id) ? '.w--current' : ''}`, {
                                    onclick: ctrl.selectCategory(category.id)
                                }, [
                                    m('div', category.name)
                                ]);
                            })),
                            m('.w-tab-content.u-margintop-40', [
                                m('.w-tab-pane.w--tab-active', [
                                    m('.w-row', (!(_.isEmpty(ctrl.selectedCategory()) && ctrl.selectedCategoryIdx() !== -1)) ? _.map(ctrl.selectedCategory(), (category) => {
                                        return [
                                            m('.w-col.w-col-5', [
                                                m('.fontsize-jumbo.u-marginbottom-20', category.name),
                                                m('a.w-button.btn.btn-medium.btn-inline.btn-dark[href="/projects/new"]', 'Comece o seu projeto')
                                            ]),
                                            m('.w-col.w-col-7', [
                                                m('.fontsize-megajumbo.fontcolor-negative', `R$ ${h.formatNumber(category.total_successful_value, 2, 3)}`),
                                                m('.fontsize-large.u-marginbottom-20', 'Doados para projetos'),
                                                m('.fontsize-megajumbo.fontcolor-negative', category.successful_projects),
                                                m('.fontsize-large.u-marginbottom-30', 'Projetos financiados'), !_.isEmpty(ctrl.featuredProjects()) ? _.map(ctrl.featuredProjects(), (project) => {
                                                    project = _.first(project);

                                                    return !_.isUndefined(project) ? m('.w-row.u-marginbottom-10', [
                                                        m('.w-col.w-col-1', [
                                                            m('img.user-avatar[src=\'https://daks2k3a4ib2z.cloudfront.net/54b440b85608e3f4389db387/558f6f5577ce56cf3faf2397_Screen%20Shot%202015-06-28%20at%2011.51.22%20AM.png\']')
                                                        ]),
                                                        m('.w-col.w-col-11', [
                                                            m('.fontsize-base.fontweight-semibold', project.user.name),
                                                            m('.fontsize-smallest', [
                                                                I18n.t('categories.pledged', I18nScope({pledged: h.formatNumber(project.pledged), contributors: project.total_contributors})),
                                                                m(`a.link-hidden[href="/${project.permalink}"]`, project.name)
                                                            ])
                                                        ])
                                                    ]) : m('.fontsize-base', I18n.t('categories.loading_featured', I18nScope()));
                                                }) : m('.fontsize-base', I18n.t('categories.no_featured', I18nScope())),
                                            ])
                                        ];
                                    }) : h.loader())
                                ])
                            ])
                        ])
                    ])
                ]),
                m.component(c.Slider, {
                    slides: testimonials(),
                    title: I18n.t('testimonials_title', I18nScope())
                }),
                m('.w-section.divider.u-margintop-30'),
                m('.w-container', [
                    m('.fontsize-larger.u-text-center.u-marginbottom-60.u-margintop-40', I18n.t('qa_title', I18nScope())),
                    m('.w-row.u-marginbottom-60', [
                        m('.w-col.w-col-6', _.map(ctrl.questions.col_1, (question) => {
                            return m.component(c.landingQA, {
                                question: question.question,
                                answer: question.answer
                            });
                        })),
                        m('.w-col.w-col-6', _.map(ctrl.questions.col_2, (question) => {
                            return m.component(c.landingQA, {
                                question: question.question,
                                answer: question.answer
                            });
                        }))
                    ])
                ]),
                m('.w-section.section-large.u-text-center.bg-purple.before-footer', [
                    m('.w-container', [
                        m('.fontsize-jumbo.fontcolor-negative.u-marginbottom-60', 'Crie o seu rascunho gratuitamente!'),
                        m('form[action="/projects/new"][method="GET"].w-row.w-form', [
                            m('.w-col.w-col-2'),
                            m('.w-col.w-col-8', [
                                m('.fontsize-larger.fontcolor-negative.u-marginbottom-10', I18n.t('form.title', I18nScope())),
                                m('input.w-input.text-field.medium.u-marginbottom-30[name=\'name\'][type=\'text\']'),
                                m('.fontsize-larger.fontcolor-negative.u-marginbottom-10', 'na categoria'),
                                m('select.w-select.text-field.medium.u-marginbottom-40[name=\'category_id\']', [
                                    m('option[value=\'\']', I18n.t('form.select_default', I18nScope())),
                                    _.map(ctrl.categories(), (category) => {
                                        return m(`option[value="${category.id}"]`, category.name);
                                    })
                                ])
                            ]),
                            m('.w-col.w-col-2'),
                            m('.w-row.u-marginbottom-80', [
                                m('.w-col.w-col-4.w-col-push-4.u-margintop-40', [
                                    m(`input[type="submit"][value="${I18n.t('form.submit', I18nScope())}"].w-button.btn.btn-large`)
                                ])
                            ])
                        ])
                    ])
                ])
            ];
        }
    };
}(window.m, window.c, window.c.h, window.c.models, window.I18n));
