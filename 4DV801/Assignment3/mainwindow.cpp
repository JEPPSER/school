#include "mainwindow.h"

#include <QDebug>
#include <QFile>

#include "mapitem.h"

MainWindow::MainWindow(QWidget *parent)
{
    Q_UNUSED(parent);

    Scene = new MapScene(0, 0, 700, 700);
    QPixmap pim = QPixmap(":/images/mock.png");
    qreal scale = Scene->width() / pim.width();
    Scene->addPixmap(pim.scaled(Scene->width(), pim.height() * scale));

    QFile tempFile(":/text/temperature-monthly-europe.csv");
    if (!tempFile.open(QIODevice::ReadOnly | QIODevice::Text)) return;
    QList<observation> observations;

    while (!tempFile.atEnd()) {
        QByteArray line = tempFile.readLine();
        QList<QByteArray> parts = line.split(',');
        observation o;
        o.station = parts[0];
        o.year = parts[1].toInt();
        o.month = parts[2].toInt();
        o.temp = parts[3].toFloat();
        o.number = parts[4].toInt();
        observations.append(o);
    }
    tempFile.close();

    QFile stationFile(":/text/stations-europe.csv");
    if (!stationFile.open(QIODevice::ReadOnly | QIODevice::Text)) return;
    QList<station> stations;

    while (!stationFile.atEnd()) {
        QByteArray line = stationFile.readLine();
        QList<QByteArray> parts = line.split(',');
        station s;
        s.id = parts[0];
        s.latitude = parts[1].toFloat();
        s.longitude = parts[2].toFloat();
        s.elevation = parts[3].toFloat();
        s.countryCode = parts[4];
        s.name = parts[5];
        s.yearFirst = parts[6].toInt();
        s.yearLast = parts[7].toInt();
        stations.append(s);
    }
    stationFile.close();

    View = new MapView(Scene);
    View->setMouseTracking(true);

    setCentralWidget(View);
}

MainWindow::~MainWindow()
{
}

