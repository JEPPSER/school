#ifndef MAINWINDOW_H
#define MAINWINDOW_H

#include <QMainWindow>
#include <QLabel>
#include <QHBoxLayout>
#include <QRadioButton>
#include <QtCharts/QChartView>

#include "mapscene.h"
#include "mapview.h"

QT_CHARTS_USE_NAMESPACE

struct observation {
    QString station;
    int year;
    int month;
    qreal temp;
    int number;
};

struct station {
    QString id;
    qreal latitude;
    qreal longitude;
    qreal elevation;
    QString countryCode;
    QString name;
    int yearFirst;
    int yearLast;
    QHash<int, qreal> averages;
};

class MainWindow : public QMainWindow
{
    Q_OBJECT

public:
    MainWindow(QWidget *parent = nullptr);
    ~MainWindow();

private slots:
    void yearChanged(int year);
    void monthChanged(int month);
    void selectionChanged();
    void loadCharts();

private:
    QPointF coordinatesToPixel(qreal lat, qreal lon);
    void loadMap();
    void initSliders(int minYear, int maxYear);
    void initLinecharts();
    void clearLayout(QLayout *layout);

    MapScene *Scene;
    MapView *View;

    int year;
    int month;
    int minYear = 3000;
    int maxYear = 0;

    QPixmap map;
    QPixmap legend;
    qreal scale;
    QHash<QString, station> stations;
    QList<observation> observations;
    QLabel *yText2;
    QLabel *mText2;
    const QList<QString> MONTHS = { "NULL", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" };
    const QList<QString> MONTHS_LONG = { "NULL", "January", "Febuary", "Mars", "April", "May", "June", "July", "August", "September", "October", "November", "December" };
    QBoxLayout *vbox;
    QHBoxLayout *averageLayout;
    QHBoxLayout *monthLayout;
    QRadioButton *radioScatter;
    QRadioButton *radioLine;
    QList<station> selectedStations;
};
#endif // MAINWINDOW_H
