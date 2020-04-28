#include "mainwindow.h"

MainWindow::MainWindow(QWidget *parent)
{
    Q_UNUSED(parent);

    Scene = new MapScene(0, 0, 500, 500);
    Scene->setBackgroundBrush(QColor(0, 0, 0));

    View = new MapView(Scene);
    View->setMouseTracking(true);

    setCentralWidget(View);
}

MainWindow::~MainWindow()
{
}

