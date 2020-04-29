#include "mainwindow.h"

#include <QDebug>
#include <QFile>
#include <QtMath>
#include <QVBoxLayout>
#include <QSlider>
#include <QDockWidget>
#include <QLabel>

#include "mapitem.h"

MainWindow::MainWindow(QWidget *parent)
{
    Q_UNUSED(parent);

    year = 2001;
    month = 7;

    Scene = new MapScene(0, 0, 700, 700);
    map = QPixmap(":/images/map.jpg");
    scale = Scene->width() / map.width();

    QFile tempFile(":/text/temperature-monthly-europe.csv");
    if (!tempFile.open(QIODevice::ReadOnly | QIODevice::Text)) return;
    tempFile.readLine();

    int minYear = 3000;
    int maxYear = -1;

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
        if (o.year < minYear) minYear = o.year;
        if (o.year > maxYear) maxYear = o.year;
    }
    tempFile.close();

    QFile stationFile(":/text/stations-europe.csv");
    if (!stationFile.open(QIODevice::ReadOnly | QIODevice::Text)) return;

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

    View = new MapView(Scene);
    View->setMouseTracking(true);

    setCentralWidget(View);

    QDockWidget *sliders = new QDockWidget;
    QWidget *temp = new QWidget;
    QBoxLayout *vbox = new QBoxLayout(QBoxLayout::TopToBottom);

    QHBoxLayout *hbox1 = new QHBoxLayout;
    QLabel *yText = new QLabel("Year: ");
    yText2 = new QLabel(QString::number(year));
    QSlider *ySlider = new QSlider(Qt::Horizontal);
    ySlider->setTickInterval(1);
    ySlider->setRange(minYear, maxYear);
    ySlider->setTickPosition(QSlider::TicksBothSides);
    ySlider->setValue(year);
    hbox1->addWidget(yText);
    hbox1->addWidget(ySlider);
    hbox1->addWidget(yText2);

    QHBoxLayout *hbox2 = new QHBoxLayout;
    QLabel *mText = new QLabel("Month: ");
    mText2 = new QLabel(MONTHS[month]);
    QSlider *mSlider = new QSlider(Qt::Horizontal);
    mSlider->setTickInterval(1);
    mSlider->setRange(1, 12);
    mSlider->setTickPosition(QSlider::TicksBothSides);
    mSlider->setValue(month);
    hbox2->addWidget(mText);
    hbox2->addWidget(mSlider);
    hbox2->addWidget(mText2);

    connect(ySlider, SIGNAL(valueChanged(int)), this, SLOT(yearChanged(int)));
    connect(mSlider, SIGNAL(valueChanged(int)), this, SLOT(monthChanged(int)));

    QString style = "QSlider::groove:horizontal {"
                        "border: 1px solid;"
                        "height: 10px;"
                        "background: #ffffff;"
                        "margin: 0px 0;"
                        "border-radius: 5px;"
                    "}"
                    "QSlider::handle:horizontal {"
                        "background: #0099cc;"
                        "border: 1px solid #000;"
                        "width: 20px;"
                        "height: 20px;"
                        "margin: -10px;"
                        "border-radius: 10px;"
                    "}"
                    "QSlider {"
                        "height: 40px;"
                    "}";

    setStyleSheet(style);

    vbox->addItem(hbox1);
    vbox->addItem(hbox2);
    temp->setLayout(vbox);
    sliders->setWidget(temp);
    addDockWidget(Qt::BottomDockWidgetArea, sliders);

    loadMap();
}

MainWindow::~MainWindow()
{
}

void MainWindow::loadMap()
{
    Scene->clear();
    Scene->addPixmap(map.scaled(Scene->width(), map.height() * scale));

    for (observation o : observations) {
        if (o.year == year && o.month == month) {
            station s = stations.value(o.station);
            QPointF point = coordinatesToPixel(s.latitude, s.longitude);
            MapItem *item = new MapItem(point.x() * scale, point.y() * scale, 15);
            QColor color;
            color.setHsl(100 - o.temp * 3, 255, 127, 255);
            item->color = color;
            Scene->addItem(item);
        }
    }
}

void MainWindow::monthChanged(int month)
{
    this->month = month;
    mText2->setText(MONTHS[month]);
    loadMap();
}

void MainWindow::yearChanged(int year)
{
    this->year = year;
    yText2->setText(QString::number(year));
    loadMap();
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

