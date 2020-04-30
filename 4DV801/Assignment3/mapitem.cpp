#include "mapitem.h"

#include <QDebug>

MapItem::MapItem(QGraphicsItem *parent) : QGraphicsObject(parent)
{
}

MapItem::MapItem(qreal x, qreal y, int size, QGraphicsItem *parent)
    : QGraphicsObject(parent)
{
    shape << QPointF(x, y) << QPointF(x + size, y) << QPointF(x + size, y + size) << QPointF(x, y + size);
}

QRectF MapItem::boundingRect() const
{
    return shape.boundingRect();
}

void MapItem::paint(QPainter *painter, const QStyleOptionGraphicsItem *option, QWidget *widget)
{
    Q_UNUSED(option);
    Q_UNUSED(widget);

    painter->setBrush(color);
    painter->drawPolygon(shape, Qt::OddEvenFill);

    if (!hover) return;

    qreal x = boundingRect().x() - 150;
    qreal y = boundingRect().y() - 110;

    painter->setBrush(Qt::black);
    painter->fillRect(x, y, 300, 110, Qt::OddEvenFill);
    painter->setPen(Qt::white);
    painter->drawText(x + 10, y + 25, name);
    painter->drawText(x + 10, y + 50, QString::number(temp) + " °C");
    painter->drawText(x + 10, y + 75, QString::number(elevation) + " meters");
    painter->drawText(x + 10, y + 100, QString::number(latitude) + ", " + QString::number(longitude));
}
