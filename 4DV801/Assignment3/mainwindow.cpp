#include "mainwindow.h"

#include <QDebug>

MainWindow::MainWindow(QWidget *parent)
{
    Q_UNUSED(parent);

    Scene = new MapScene(0, 0, 700, 700);
    QPixmap pim = QPixmap(":/images/mock.png");
    qreal scale = Scene->width() / pim.width();
    Scene->addPixmap(pim.scaled(Scene->width(), pim.height() * scale));

    View = new MapView(Scene);
    View->setMouseTracking(true);

    setCentralWidget(View);
}

MainWindow::~MainWindow()
{
}

