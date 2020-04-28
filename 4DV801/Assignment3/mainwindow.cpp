#include "mainwindow.h"

#include <QDebug>
#include <QFile>
#include <QtMath>

#include "mapitem.h"

MainWindow::MainWindow(QWidget *parent)
{
    Q_UNUSED(parent);

    year = 1995;
    month = 6;

    Scene = new MapScene(0, 0, 700, 700);
    QPixmap pim = QPixmap(":/images/map.jpg");
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
    QHash<QString, station> stations;

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
        stations.insert(s.id, s);
    }
    stationFile.close();

    for (observation o : observations) {
        if (o.year == year && o.month == month) {
            station s = stations.value(o.station);
            QPointF point = coordinatesToPixel(s.latitude, s.longitude);
            MapItem *item = new MapItem(point.x() * scale, point.y() * scale);
            Scene->addItem(item);
        }
    }

    View = new MapView(Scene);
    View->setMouseTracking(true);

    setCentralWidget(View);
}

MainWindow::~MainWindow()
{
}

QPointF MainWindow::coordinatesToPixel(qreal lat, qreal lon)
{
    int mapWidth = 3000;
    int mapHeight = 2250;

    qreal mapLonLeft = -32.9;
    qreal mapLonRight = 60.625;
    qreal mapLonDelta = mapLonRight - mapLonLeft;

    qreal mapLatBottom = 24.83;
    qreal mapLatBottomDegree = mapLatBottom * M_PI / 180;

    qreal x = (lon - mapLonLeft) * (mapWidth / mapLonDelta);

    lat = lat * M_PI / 180;
    qreal worldMapWidth = ((mapWidth / mapLonDelta) * 360) / (2 * M_PI);
    qreal mapOffsetY = (worldMapWidth / 2 * log((1 + sin(mapLatBottomDegree)) / (1 - sin(mapLatBottomDegree))));

    qreal y = mapHeight - ((worldMapWidth / 2 * log((1 + sin(lat)) / (1 - sin(lat)))) - mapOffsetY);
    y += 270; // Hack

    return QPointF(x, y);
}

