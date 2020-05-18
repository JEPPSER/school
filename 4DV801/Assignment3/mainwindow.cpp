#include "mainwindow.h"

#include <QDebug>
#include <QFile>
#include <QtMath>
#include <QVBoxLayout>
#include <QSlider>
#include <QDockWidget>
#include <QLabel>
#include <QScrollArea>

#include <QtCharts/QChartView>
#include <QtCharts/QLineSeries>

#include "mapitem.h"

QT_CHARTS_USE_NAMESPACE

MainWindow::MainWindow(QWidget *parent)
{
    Q_UNUSED(parent);

    year = 2001;
    month = 7;

    Scene = new MapScene(0, 0, 900, 700);
    connect(Scene, SIGNAL(mouseReleased()), this, SLOT(selectionChanged()));

    map = QPixmap(":/images/map.jpg");
    scale = Scene->width() / map.width();

    QFile tempFile(":/text/temperature-monthly-europe.csv");
    if (!tempFile.open(QIODevice::ReadOnly | QIODevice::Text)) return;
    tempFile.readLine();

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

    while (!stationFile.atEnd()) {
        QByteArray line = stationFile.readLine();
        QList<QByteArray> parts = line.split(',');
        station s;
        s.id = parts[0];
        s.latitude = parts[1].toFloat();
        s.longitude = parts[2].toFloat();
        s.elevation = parts[3].toFloat();
        s.countryCode = parts[4];
        s.name = parts[5].remove(0, 1);
        s.name.remove(s.name.length() - 1, 1);
        s.yearFirst = parts[6].toInt();
        s.yearLast = parts[7].toInt();

        // Calculating average temp of each year.
        for (int index = s.yearFirst; index <= s.yearLast; index++) {
            qreal average = 0;
            int count = 0;

            for (observation o : observations) {
                if (o.station == s.id && o.year == index) {
                    average += o.temp;
                    count++;
                }

            }

            if (count != 0) {
                average /= count;
                s.averages.insert(index, average);
            }
        }

        stations.insert(s.id, s);
    }
    stationFile.close();

    // Finding min and max values.
    for (station s : stations) {
        for (qreal temp : s.averages) {
            if (temp < minAvTemp) minAvTemp = temp;
            if (temp > maxAvTemp) maxAvTemp = temp;
        }

        if (s.yearFirst < minYear && s.yearFirst != 0) minYear = s.yearFirst;
        if (s.yearLast > maxYear && s.yearLast != 0) maxYear = s.yearLast;
    }

    View = new MapView(Scene);
    View->setMinimumHeight(Scene->height());
    View->setMouseTracking(true);

    setCentralWidget(View);

    initSliders(minYear, maxYear);
    initLinecharts();

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

    loadMap();
}

MainWindow::~MainWindow()
{

}

void MainWindow::initLinecharts()
{
    {
        QScrollArea *scroll = new QScrollArea;
        scroll->setMinimumSize(500, 250);
        averageLayout = new QHBoxLayout;
        QWidget *temp = new QWidget;
        temp->setLayout(averageLayout);
        scroll->setWidget(temp);
        scroll->setWidgetResizable(true);
        vbox->addWidget(scroll);
    }

    {
        QScrollArea *scroll = new QScrollArea;
        scroll->setMinimumSize(500, 250);
        monthLayout = new QHBoxLayout;
        QWidget *temp = new QWidget;
        temp->setLayout(monthLayout);
        scroll->setWidget(temp);
        scroll->setWidgetResizable(true);
        vbox->addWidget(scroll);
    }
}

void MainWindow::initSliders(int minYear, int maxYear)
{
    QDockWidget *sliders = new QDockWidget;
    QWidget *temp = new QWidget;
    vbox = new QBoxLayout(QBoxLayout::TopToBottom);

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

    vbox->addItem(hbox1);
    vbox->addItem(hbox2);
    temp->setLayout(vbox);
    sliders->setWidget(temp);
    addDockWidget(Qt::RightDockWidgetArea, sliders);
}

void MainWindow::loadMap()
{
    Scene->clear();
    Scene->hoverItem = nullptr;
    Scene->addPixmap(map.scaled(Scene->width(), map.height() * scale));

    for (observation o : observations) {
        if (o.year == year && o.month == month) {
            station s = stations.value(o.station);
            QPointF point = coordinatesToPixel(s.latitude, s.longitude);
            MapItem *item = new MapItem(point.x() * scale, point.y() * scale, 15);
            item->id = s.id;
            item->name = s.name;
            item->temp = o.temp;
            item->elevation = s.elevation;
            item->latitude = s.latitude;
            item->longitude = s.longitude;
            QColor color;
            color.setHsl(100 - o.temp * 3, 255, 127, 255);
            item->color = color;
            Scene->addItem(item);
        }
    }
}

void MainWindow::selectionChanged()
{
    // Clear line charts.
    clearLayout(averageLayout);
    clearLayout(monthLayout);

    qreal minTemp = 1000;
    qreal maxTemp = -1000;

    for (QGraphicsItem *i : Scene->selectedItems()) {
        MapItem *sItem = dynamic_cast<MapItem *>(i);
        if (sItem == nullptr) continue;

        for (observation o : observations) {
            if (sItem->id == o.station && o.month == month) {
                if (o.temp < minTemp) minTemp = o.temp;
                if (o.temp > maxTemp) maxTemp = o.temp;
            }
        }
    }

    // Loop through all selected stations.
    for (QGraphicsItem *i : Scene->selectedItems()) {
        MapItem *sItem = dynamic_cast<MapItem *>(i);
        if (sItem == nullptr) continue;

        // Create average line chart
        {
            QChart *chart = new QChart;
            QLineSeries *series = new QLineSeries;

            station s = stations.value(sItem->id);
            for (int index = s.yearFirst; index <= s.yearLast; index++) {
                qreal val = s.averages[index];
                if (val != 0) series->append(index, s.averages[index]);
            }

            chart->addSeries(series);
            chart->legend()->hide();
            chart->setTitle(sItem->name);
            chart->createDefaultAxes();
            chart->axes().first()->hide();
            chart->axes().first()->setMin(minYear);
            chart->axes().first()->setMax(maxYear);
            chart->axes().last()->setMin(minAvTemp);
            chart->axes().last()->setMax(maxAvTemp);
            chart->setMargins(QMargins(0, 0, 0, 0));
            chart->setMaximumSize(200, 200);
            chart->setMinimumSize(200, 200);

            QChartView *chartView = new QChartView(chart);
            chartView->setRenderHint(QPainter::Antialiasing);
            averageLayout->addWidget(chartView);
        }

        // Create month line chart
        {
            QChart *chart = new QChart;
            QLineSeries *series = new QLineSeries;

            for (observation o : observations) {
                if (o.station == sItem->id && o.month == month) {
                    series->append(o.year, o.temp);
                }
            }

            chart->addSeries(series);
            chart->legend()->hide();
            chart->setTitle(sItem->name);
            chart->createDefaultAxes();
            chart->axes().first()->hide();
            chart->axes().first()->setMin(minYear);
            chart->axes().first()->setMax(maxYear);
            chart->axes().last()->setMin(minTemp - 3);
            chart->axes().last()->setMax(maxTemp + 3);
            chart->setMargins(QMargins(0, 0, 0, 0));
            chart->setMaximumSize(200, 200);
            chart->setMinimumSize(200, 200);

            QChartView *chartView = new QChartView(chart);
            chartView->setRenderHint(QPainter::Antialiasing);
            monthLayout->addWidget(chartView);
        }
    }
}

void MainWindow::clearLayout(QLayout *layout) {
    QLayoutItem *item;
    while((item = layout->takeAt(0))) {
        if (item->layout()) {
            clearLayout(item->layout());
            delete item->layout();
        }
        if (item->widget()) {
           delete item->widget();
        }
        delete item;
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

